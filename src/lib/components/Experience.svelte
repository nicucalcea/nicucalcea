<script lang="ts">
	import { getFavicon } from '$lib/utils/getIcon.js';

	interface Props {
		experiences: any[];
		featured?: boolean;
	}

	let { experiences, featured = false }: Props = $props();

	// Sort experiences chronologically, newest first
	// Optionally filter to only featured experiences
	const sortedExperiences = $derived(
		experiences
			.filter((exp) => (featured ? exp.featured === true : true))
			.sort((a, b) => {
				const aStart = new Date(a.startDate).getTime();
				const bStart = new Date(b.startDate).getTime();
				// If start dates are the same, sort by end date (current jobs first)
				if (aStart === bStart) {
					if (!a.endDate) return -1; // Current job comes first
					if (!b.endDate) return 1;
					return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
				}
				return bStart - aStart;
			})
	);

	// Helper functions to handle both work experience and education data formats
	function getTitle(item: any): string {
		return item.name || item.institution || '';
	}

	function getSubtitle(item: any): string {
		if (item.position) {
			return item.position;
		}
		if (item.studyType && item.area) {
			return `${item.studyType} in ${item.area}`;
		}
		return item.studyType || item.area || '';
	}

	function formatDate(dateString: string): string {
		if (!dateString) return 'Present';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short'
		});
	}

	function formatDateRange(startDate: string, endDate: string): string {
		const start = formatDate(startDate);
		const end = formatDate(endDate);
		return `${start} - ${end}`;
	}

	function isCurrentPosition(endDate: string): boolean {
		return !endDate || endDate === '';
	}
</script>

<ul class="card experience">
	{#each sortedExperiences as experience}
		<li>
			<span class="favicon" aria-hidden="true">
				<img src={getFavicon(experience.url)} alt="" width="24" height="24" loading="lazy" />
			</span>
			<div class="details">
				<div class="heading">
					<h3>
						{#if experience.url && experience.url.trim() !== ''}
							<a href={experience.url} target="_blank" rel="noopener noreferrer">{getTitle(experience)}</a>
						{:else}
							{getTitle(experience)}
						{/if}
					</h3>
					{#if isCurrentPosition(experience.endDate)}
						<span class="label current">Current</span>
					{/if}
				</div>
				<div class="meta">
					<span class="role">{getSubtitle(experience)}</span>
					<span aria-hidden="true">•</span>
					<span>{formatDateRange(experience.startDate, experience.endDate)}</span>
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.experience {
		display: grid;
		gap: var(--sz-space-4);
		margin: 0;
		padding: var(--sz-space-4);
		list-style: none;
	}

	li {
		display: flex;
		align-items: flex-start;
		gap: var(--sz-space-3);
	}

	li + li {
		padding-top: var(--sz-space-4);
		border-top: 1px solid var(--sz-color-border-soft);
	}

	.favicon {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
		background: var(--sz-color-surface-low);
	}

	.favicon img {
		width: 1.5rem;
		height: 1.5rem;
		object-fit: contain;
	}

	.details {
		flex: 1;
		min-width: 0;
	}

	.heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sz-space-2);
	}

	h3 {
		font-size: 1rem;
		line-height: 1.2;
	}

	h3 a {
		color: var(--sz-color-ink);
		text-decoration: none;
		transition: color var(--transition);
	}

	h3 a:hover {
		color: var(--sz-color-accent-text);
	}

	.current {
		flex-shrink: 0;
		color: var(--sz-color-accent-text);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--sz-space-2);
		margin-top: 0.125rem;
		font-size: 0.875rem;
		color: var(--sz-color-muted);
	}

	.role {
		font-weight: var(--sz-font-weight-medium);
	}
</style>
