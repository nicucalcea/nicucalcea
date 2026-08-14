<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { getFavicon } from '$lib/utils/getIcon.js';

	interface Publication {
		name: string;
		publisher?: string;
		releaseDate: string;
		url: string;
		summary?: string;
		partners?: Array<{
			name: string;
			url: string;
		}>;
		tags?: string[];
		featured?: boolean;
	}

	interface Props {
		publications: Publication[];
		featured?: boolean;
	}

	let { publications, featured = false }: Props = $props();

	// Sort publications chronologically, newest first
	// Optionally filter to only featured publications
	const sortedPublications = $derived(
		[...publications]
			.filter(pub => featured ? pub.featured === true : true)
			.sort((a, b) => {
				return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
			})
	);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="space-y-6">
	{#each sortedPublications as publication}
		<article class="border border-border bg-card p-6">
			<div class="space-y-3">
				<h3 class="font-display text-lg font-bold leading-snug">
					<a
						href={publication.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-foreground hover:text-[var(--sz-color-accent-text)] transition-colors"
					>
						{publication.name}
					</a>
				</h3>

				{#if publication.publisher}
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<img
							src={getFavicon(publication.url)}
							alt=""
							class="w-4 h-4 flex-shrink-0"
							loading="lazy"
						/>
						<a
							href="/work/?publication={encodeURIComponent(publication.publisher)}"
							class="font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							{publication.publisher}
						</a>
						<span aria-hidden="true">•</span>
						<span>{formatDate(publication.releaseDate)}</span>
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">{formatDate(publication.releaseDate)}</p>
				{/if}

				{#if publication.summary}
					<p class="text-foreground leading-relaxed">{publication.summary}</p>
				{/if}

				{#if publication.partners && publication.partners.length > 0}
					<div class="flex flex-wrap items-center gap-2 pt-1">
						<span class="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Also in</span>
						{#each publication.partners as partner}
							<a
								href={partner.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-border text-muted-foreground hover:text-[var(--sz-color-accent-text)] hover:border-[var(--sz-color-border-accent)] transition-colors"
							>
								<img
									src={getFavicon(partner.url)}
									alt=""
									class="w-3 h-3 flex-shrink-0"
									loading="lazy"
								/>
								{partner.name}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</article>
	{/each}
</div>