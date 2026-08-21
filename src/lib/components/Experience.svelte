<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
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
			.filter(exp => featured ? exp.featured === true : true)
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

<div class="border border-border bg-card p-6">
	<div class="space-y-6">
		{#each sortedExperiences as experience, index}
			<div class="flex items-start gap-4">
				<div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-secondary mt-0.5">
					<img
						src={getFavicon(experience.url)}
						alt=""
						class="w-6 h-6 object-contain"
						loading="lazy"
					/>
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center justify-between gap-2">
						<div class="flex-1 min-w-0">
							{#if experience.url && experience.url.trim() !== ''}
								<a
									href={experience.url}
									target="_blank"
									rel="noopener noreferrer"
									class="font-display text-base font-black tracking-[-0.04em] text-foreground hover:text-[var(--sz-color-accent-text)] transition-colors"
								>
									{getTitle(experience)}
								</a>
							{:else}
								<h3 class="font-display text-base font-black tracking-[-0.04em] text-foreground">{getTitle(experience)}</h3>
							{/if}
						</div>
						{#if isCurrentPosition(experience.endDate)}
							<span class="font-display text-xs font-bold uppercase tracking-[0.18em] text-[var(--sz-color-accent-text)]">Current</span>
						{/if}
					</div>
					<div class="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
						<span class="font-medium">{getSubtitle(experience)}</span>
						<span aria-hidden="true">•</span>
						<span>{formatDateRange(experience.startDate, experience.endDate)}</span>
					</div>
				</div>
			</div>
			{#if index < sortedExperiences.length - 1}
				<hr class="border-border" />
			{/if}
		{/each}
	</div>
</div>