<script lang="ts">
	// Career timeline — plain HTML/CSS, positioned in percentages so it scales
	// to any width without measuring. Non-overlapping roles share a lane, and a
	// readout below replaces hover tooltips so it works by tap and keyboard.
	import Icon from './Icon.svelte';
	import { getFavicon } from '$lib/utils/getIcon.js';

	type WorkExperience = {
		name: string;
		position: string;
		url?: string;
		location?: string;
		startDate: string;
		endDate: string;
		summary?: string;
	};

	type Education = {
		institution: string;
		area: string;
		studyType: string;
		url?: string;
		startDate: string;
		endDate: string;
	};

	type Props = {
		experiences: WorkExperience[];
		education: Education[];
	};

	type Item = {
		key: string;
		kind: 'work' | 'education';
		title: string;
		subtitle: string;
		url?: string;
		location?: string;
		summary?: string;
		start: Date;
		end: Date;
		current: boolean;
	};

	let { experiences, education }: Props = $props();

	const now = new Date();

	const items = $derived.by(() => {
		const toItem = (kind: Item['kind'], i: number, title: string, subtitle: string, entry: any): Item => ({
			key: `${kind}-${i}`,
			kind,
			title,
			subtitle,
			url: entry.url,
			location: entry.location,
			summary: entry.summary,
			start: new Date(entry.startDate),
			end: entry.endDate ? new Date(entry.endDate) : now,
			current: !entry.endDate
		});

		return [
			...experiences
				.filter((exp) => exp.startDate)
				.map((exp, i) => toItem('work', i, exp.name, exp.position, exp)),
			...education
				.filter((edu) => edu.startDate)
				.map((edu, i) => toItem('education', i, edu.institution, `${edu.studyType} in ${edu.area}`, edu))
		].sort((a, b) => a.start.getTime() - b.start.getTime());
	});

	// Domain runs from January of the first year to today
	const domainStart = $derived(new Date(Math.min(...items.map((item) => item.start.getFullYear())), 0, 1));
	const span = $derived(now.getTime() - domainStart.getTime());
	const pct = (date: Date) => ((date.getTime() - domainStart.getTime()) / span) * 100;

	const years = $derived(
		Array.from({ length: now.getFullYear() - domainStart.getFullYear() + 1 }, (_, i) => domainStart.getFullYear() + i)
	);

	// Greedy lane packing: each item goes in the first lane that has finished
	function pack(list: Item[]): Item[][] {
		const lanes: Item[][] = [];
		for (const item of list) {
			const lane = lanes.find((l) => l[l.length - 1].end <= item.start);
			if (lane) lane.push(item);
			else lanes.push([item]);
		}
		return lanes;
	}

	const groups = $derived([
		{ label: 'Work', lanes: pack(items.filter((item) => item.kind === 'work')) },
		{ label: 'Education', lanes: pack(items.filter((item) => item.kind === 'education')) }
	]);

	// Most recent role is selected by default; hovering previews another
	const latestWork = $derived(items.filter((item) => item.kind === 'work').at(-1));
	let selectedKey = $state<string>();
	let hoveredKey = $state<string>();
	const selectedIndex = $derived(
		Math.max(
			0,
			items.findIndex((item) => item.key === (selectedKey ?? latestWork?.key))
		)
	);
	const active = $derived(items.find((item) => item.key === hoveredKey) ?? items[selectedIndex]);

	// Explicit choices (click, tap, focus, stepping) override any hover preview
	function select(key: string) {
		selectedKey = key;
		hoveredKey = undefined;
	}

	const step = (delta: number) => select(items[(selectedIndex + delta + items.length) % items.length].key);

	const formatDate = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	const range = (item: Item) => `${formatDate(item.start)} – ${item.current ? 'Present' : formatDate(item.end)}`;

	// e.g. "2 yrs 4 mos", rounded to whole months
	function duration(item: Item) {
		const months = Math.max(1, Math.round((item.end.getTime() - item.start.getTime()) / 2629746000));
		const [y, m] = [Math.floor(months / 12), months % 12];
		return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
	}
</script>

{#if items.length}
	<figure class="timeline">
		<div class="plot" role="group" aria-label="Career timeline" onpointerleave={() => (hoveredKey = undefined)}>
			<div class="gridlines" aria-hidden="true">
				{#each years as year}
					<span style:left="{pct(new Date(year, 0, 1))}%"></span>
				{/each}
			</div>

			{#each groups as group, g}
				<p class="label group-label" style:--g={g}>{group.label}</p>
				<div class="lanes" style:--g={g}>
					{#each group.lanes as lane}
						<div class="lane">
							{#each lane as item (item.key)}
								<button
									type="button"
									class="bar {item.kind}"
									class:active={item === active}
									style:--x="{pct(item.start)}%"
									style:--w="{pct(item.end) - pct(item.start)}%"
									aria-pressed={item === items[selectedIndex]}
									aria-label="{item.title}, {item.subtitle}, {range(item)}"
									onpointerenter={(e) => e.pointerType === 'mouse' && (hoveredKey = item.key)}
									onfocus={() => select(item.key)}
									onclick={() => select(item.key)}
								>
									<span class="bar-label">{item.title}</span>
								</button>
							{/each}
						</div>
					{/each}
				</div>
			{/each}

			<div class="axis" aria-hidden="true">
				{#each years as year, i}
					<span class:odd={i % 2 === 1} class:off-four={i % 4 !== 0} style:left="{pct(new Date(year, 0, 1))}%">{year}</span>
				{/each}
			</div>
		</div>

		{#if active}
			<figcaption class="readout">
				<div class="readout-head">
					<p class="label dates">
						<span class="range">{range(active)}</span><span class="duration">{duration(active)}</span>
						{#if active.current}<span class="current">Current</span>{/if}
					</p>
					<div class="stepper">
						<button type="button" aria-label="Previous role" onclick={() => step(-1)}>
							<Icon name="chevron-left" size={18} strokeWidth={2.2} />
						</button>
						<span class="label count">{selectedIndex + 1}/{items.length}</span>
						<button type="button" aria-label="Next role" onclick={() => step(1)}>
							<Icon name="chevron-right" size={18} strokeWidth={2.2} />
						</button>
					</div>
				</div>
				<div class="heading">
					<span class="favicon" aria-hidden="true">
						<img src={getFavicon(active.url ?? '')} alt="" width="28" height="28" />
					</span>
					<div>
						<h3>{active.title}</h3>
						<p class="subtitle">
							{active.subtitle}{#if active.location}<span aria-hidden="true">{' • '}</span>{active.location}{/if}
						</p>
					</div>
				</div>
				{#if active.summary}
					<p class="summary">{active.summary}</p>
				{/if}
			</figcaption>
		{/if}
	</figure>
{/if}

<style>
	.timeline {
		container: timeline / inline-size;
		margin: 0;
		padding: clamp(1rem, 3vw, 1.5rem);
		border: 1px solid var(--sz-color-border-soft);
		background: var(--sz-chart-surface);
	}

	/* Narrow: labels stack above their lanes. Wide: a label column. */
	.plot {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: repeat(5, auto);
		row-gap: var(--sz-space-2);
	}

	.gridlines {
		position: relative;
		grid-column: 1;
		grid-row: 1 / -1;
		pointer-events: none;
	}

	.gridlines span {
		position: absolute;
		top: 0;
		bottom: 0;
		border-left: 1px solid var(--sz-chart-gridline);
	}

	.group-label {
		position: relative;
		grid-column: 1;
		grid-row: calc(var(--g) * 2 + 1);
		margin: 0;
		color: var(--sz-chart-muted);
	}

	.lanes {
		position: relative;
		grid-column: 1;
		grid-row: calc(var(--g) * 2 + 2);
		display: grid;
		gap: 0.375rem;
		margin-bottom: var(--sz-space-2);
	}

	.lane {
		position: relative;
		height: 1.75rem;
	}

	.bar {
		container-type: inline-size;
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(var(--x) + 1px);
		width: max(0.375rem, calc(var(--w) - 2px));
		padding: 0;
		border: 0;
		border-radius: 0;
		background: var(--sz-color-surface-highest);
		box-shadow: inset 2px 0 0 var(--sz-chart-baseline);
		color: var(--sz-chart-foreground);
		font-size: 0.75rem;
		font-weight: var(--sz-font-weight-medium);
		text-align: left;
		cursor: pointer;
		transition:
			background-color var(--transition),
			box-shadow var(--transition),
			color var(--transition);
	}

	.bar.education {
		background: var(--sz-color-surface-high);
		box-shadow: inset 2px 0 0 var(--sz-chart-axis);
	}

	.bar:hover,
	.bar.active {
		background: var(--sz-color-primary-container);
		box-shadow: none;
		color: var(--sz-color-on-primary);
	}

	.bar:focus-visible {
		z-index: 1;
		outline-offset: 2px;
	}

	.bar-label {
		display: block;
		padding: 0 0.5rem;
		overflow: hidden;
		white-space: nowrap;
		-webkit-mask-image: linear-gradient(to right, #000 calc(100% - 1.25rem), transparent);
		mask-image: linear-gradient(to right, #000 calc(100% - 1.25rem), transparent);
	}

	/* Hide labels that would only show an ellipsis */
	@container (max-width: 3.5rem) {
		.bar-label {
			display: none;
		}
	}

	.axis {
		position: relative;
		grid-column: 1;
		grid-row: 5;
		height: 1.25rem;
		border-top: 1px solid var(--sz-chart-baseline);
		color: var(--sz-chart-muted);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
	}

	.axis span {
		position: absolute;
		top: 0.25rem;
		transform: translateX(-50%);
		line-height: 1;
	}

	/* Thin out year labels as the chart narrows */
	@container timeline (max-width: 40rem) {
		.axis .odd {
			display: none;
		}
	}

	@container timeline (max-width: 24rem) {
		.axis .off-four {
			display: none;
		}
	}

	@container timeline (min-width: 36rem) {
		.plot {
			grid-template-columns: 6rem minmax(0, 1fr);
			grid-template-rows: repeat(3, auto);
			column-gap: var(--sz-space-3);
		}

		.gridlines,
		.lanes,
		.axis {
			grid-column: 2;
		}

		.group-label,
		.lanes {
			grid-row: calc(var(--g) + 1);
		}

		.group-label {
			grid-column: 1;
			align-self: center;
			margin-bottom: var(--sz-space-2);
		}

		.axis {
			grid-row: 3;
		}
	}

	.readout {
		display: grid;
		gap: var(--sz-space-3);
		margin-top: var(--sz-space-4);
		padding-top: var(--sz-space-4);
		border-top: 1px solid var(--sz-color-border-soft);
	}

	.readout-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sz-space-3);
	}

	.dates {
		color: var(--sz-color-muted);
	}

	.range {
		white-space: nowrap;
	}

	/* Narrow: duration on its own line. Wide: inline after a dot. */
	.duration {
		display: block;
		margin-top: 0.4em;
	}

	@container timeline (min-width: 30rem) {
		.duration {
			display: inline;
		}

		.duration::before {
			content: '·';
			margin-inline: 0.6em;
		}
	}

	.current {
		margin-left: var(--sz-space-3);
		color: var(--sz-color-accent-text);
	}

	.stepper {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--sz-space-1);
		margin-left: auto;
	}

	.stepper button {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 1px solid var(--sz-color-border-soft);
		border-radius: var(--sz-radius-full);
		background: var(--sz-color-surface-lowest);
		color: var(--sz-color-ink-soft);
		cursor: pointer;
		transition:
			color var(--transition),
			border-color var(--transition);
	}

	.stepper button:hover {
		border-color: var(--sz-color-border-accent);
		color: var(--sz-color-accent-text);
	}

	.count {
		min-width: 2.75rem;
		text-align: center;
		color: var(--sz-color-muted);
		font-variant-numeric: tabular-nums;
	}

	.heading {
		display: flex;
		align-items: flex-start;
		gap: var(--sz-space-3);
	}

	.favicon {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		flex-shrink: 0;
		background: var(--sz-color-surface-low);
	}

	.favicon img {
		width: 1.75rem;
		height: 1.75rem;
		object-fit: contain;
	}

	h3 {
		margin-bottom: var(--sz-space-2);
		font-size: clamp(1.375rem, 3vw, 1.75rem);
	}

	.subtitle {
		font-weight: var(--sz-font-weight-medium);
		color: var(--sz-color-muted);
	}

	@container timeline (min-width: 48rem) {
		.readout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
			align-items: start;
			column-gap: var(--sz-space-5);
		}

		.readout-head {
			grid-column: 1 / -1;
		}
	}

	.summary {
		max-width: 48rem;
		font-size: 0.9375rem;
		line-height: 1.65;
		color: var(--sz-color-muted);
	}
</style>
