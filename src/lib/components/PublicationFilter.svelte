<script lang="ts">
	import Icon from './Icon.svelte';

	interface Publication {
		publisher?: string;
		releaseDate: string;
	}

	interface Props {
		publications: Publication[];
		onFilterChange: (filters: { publisher: string; year: string }) => void;
		initialPublisher?: string;
		initialYear?: string;
		resultCount: number;
	}

	let { publications, onFilterChange, initialPublisher = '', initialYear = '', resultCount }: Props = $props();

	// Publishers sorted by their most recent publication (newest first)
	const publishers = $derived.by(() => {
		const latest = new Map<string, number>();
		for (const pub of publications) {
			if (!pub.publisher) continue;
			const time = new Date(pub.releaseDate).getTime();
			if (time > (latest.get(pub.publisher) ?? -Infinity)) latest.set(pub.publisher, time);
		}
		return [...latest.keys()].sort((a, b) => latest.get(b)! - latest.get(a)!);
	});

	const years = $derived(
		[...new Set(publications.map((pub) => new Date(pub.releaseDate).getFullYear().toString()))].sort(
			(a, b) => Number(b) - Number(a)
		)
	);

	const filtered = $derived(Boolean(initialPublisher || initialYear));
</script>

<div class="filters">
	<div class="controls">
		<div class="field">
			<label class="label" for="publisher-filter">Publisher</label>
			<div class="select">
				<select
					id="publisher-filter"
					value={initialPublisher}
					onchange={(event) => onFilterChange({ publisher: event.currentTarget.value, year: initialYear })}
				>
					<option value="">All publishers</option>
					{#each publishers as publisher}
						<option value={publisher}>{publisher}</option>
					{/each}
				</select>
				<Icon name="chevron-down" size={18} strokeWidth={2.2} />
			</div>
		</div>

		<div class="field">
			<label class="label" for="year-filter">Year</label>
			<div class="select">
				<select
					id="year-filter"
					value={initialYear}
					onchange={(event) => onFilterChange({ publisher: initialPublisher, year: event.currentTarget.value })}
				>
					<option value="">All years</option>
					{#each years as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
				<Icon name="chevron-down" size={18} strokeWidth={2.2} />
			</div>
		</div>

		{#if filtered}
			<button type="button" class="label clear" onclick={() => onFilterChange({ publisher: '', year: '' })}>
				Clear filters
			</button>
		{/if}
	</div>

	<p class="summary" aria-live="polite">
		Showing {resultCount}
		{resultCount === 1 ? 'publication' : 'publications'}
		{#if filtered}
			filtered by
			{#if initialPublisher}<strong>{initialPublisher}</strong>{/if}
			{#if initialPublisher && initialYear}and{/if}
			{#if initialYear}<strong>{initialYear}</strong>{/if}
		{/if}
	</p>
</div>

<style>
	.filters {
		margin-bottom: var(--sz-space-5);
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 1rem 1.5rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		width: 100%;
	}
	label {
		color: var(--sz-color-muted);
	}
	.select {
		position: relative;
		color: var(--sz-color-muted);
	}
	.select :global(svg) {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		pointer-events: none;
	}
	select {
		appearance: none;
		width: 100%;
		min-height: 44px;
		padding: 0.75rem 3rem 0.75rem 1rem;
		border: 1px solid var(--sz-color-muted);
		border-radius: 0;
		background: var(--sz-color-surface-lowest);
		color: var(--sz-color-ink);
		font-size: 1rem;
		cursor: pointer;
		transition: border-color var(--transition);
	}
	select:hover {
		border-color: var(--sz-color-primary-container);
	}
	.clear {
		min-height: 44px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--sz-color-muted);
		cursor: pointer;
		transition: color var(--transition);
	}
	.clear:hover {
		color: var(--sz-color-accent-text);
	}
	.summary {
		margin: 1.25rem 0 0;
		font-size: 1rem;
		color: var(--sz-color-muted);
	}
	.summary strong {
		font-weight: var(--sz-font-weight-medium);
		color: var(--sz-color-ink);
	}
	@media (min-width: 640px) {
		.field {
			width: 16rem;
		}
		.field + .field {
			width: 11rem;
		}
	}
</style>
