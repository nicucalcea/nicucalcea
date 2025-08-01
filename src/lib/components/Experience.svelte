<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
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

<Card class="transition-shadow hover:shadow-md py-0">
	<CardContent class="p-4">
		<div class="space-y-4">
			{#each sortedExperiences as experience, index}
				<div class="flex items-start gap-3">
					<div class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-secondary rounded-lg mt-1">
						<img 
							src={getFavicon(experience.url)} 
							alt="" 
							class="w-8 h-8 object-contain"
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
										class="text-lg font-semibold text-primary hover:text-primary/80 hover:underline"
									>
										{getTitle(experience)}
									</a>
								{:else}
									<h3 class="text-lg font-semibold text-foreground">{getTitle(experience)}</h3>
								{/if}
							</div>
							{#if isCurrentPosition(experience.endDate)}
								<Badge variant="default" class="flex-shrink-0">Current</Badge>
							{/if}
						</div>
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							<span class="font-semibold">{getSubtitle(experience)}</span>
							<span>•</span>
							<span class="font-normal">{formatDateRange(experience.startDate, experience.endDate)}</span>
						</div>
					</div>
				</div>
				{#if index < sortedExperiences.length - 1}
					<hr class="border-border" />
				{/if}
			{/each}
		</div>
	</CardContent>
</Card>
