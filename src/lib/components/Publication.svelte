<script lang="ts">
	import { page } from '$app/state';
	import { getFavicon } from '#lib/utils/getIcon.js';

	interface Publication {
		name: string;
		publisher?: string;
		releaseDate: string;
		url?: string;
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
		/** Heading level for each title, to follow the page's outline */
		headingLevel?: 2 | 3;
	}

	let { publications, featured = false, headingLevel = 3 }: Props = $props();

	const icon = (url?: string) => getFavicon(url, page.data.missingFavicons);

	// Sort publications chronologically, newest first
	// Optionally filter to only featured publications
	const sortedPublications = $derived(
		[...publications]
			.filter((pub) => (featured ? pub.featured === true : true))
			.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
	);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="publications">
	{#each sortedPublications as publication (publication.url ?? publication.name)}
		<article class="card" class:card-interactive={publication.url}>
			<svelte:element this={`h${headingLevel}`} class="title">
				{#if publication.url}
					<a href={publication.url} target="_blank" rel="noopener noreferrer">{publication.name}</a>
				{:else}
					{publication.name}
				{/if}
			</svelte:element>

			{#if publication.publisher}
				<div class="meta">
					<img src={icon(publication.url)} alt="" width="16" height="16" loading="lazy" />
					<a class="publisher" href="/work/?publication={encodeURIComponent(publication.publisher)}">
						{publication.publisher}
					</a>
					<span aria-hidden="true">•</span>
					<span>{formatDate(publication.releaseDate)}</span>
				</div>
			{:else}
				<p class="meta">{formatDate(publication.releaseDate)}</p>
			{/if}

			{#if publication.summary}
				<p class="summary">{publication.summary}</p>
			{/if}

			{#if publication.partners && publication.partners.length > 0}
				<div class="partners">
					<span class="label muted">Also in</span>
					{#each publication.partners as partner}
						<a href={partner.url} target="_blank" rel="noopener noreferrer">
							<img src={icon(partner.url)} alt="" width="12" height="12" loading="lazy" />
							{partner.name}
						</a>
					{/each}
				</div>
			{/if}
		</article>
	{/each}
</div>

<style>
	.publications {
		display: grid;
		gap: var(--sz-space-4);
	}

	article {
		display: grid;
		gap: 0.75rem;
		padding: var(--sz-space-4);
		/* Skip layout and paint for off-screen cards; /work lists over a thousand */
		content-visibility: auto;
		contain-intrinsic-size: auto 13rem;
	}

	.title {
		font-size: 1.125rem;
		line-height: 1.2;
	}

	.title a {
		color: var(--sz-color-ink);
		text-decoration: none;
		transition: color var(--transition);
	}

	.title a:hover {
		color: var(--sz-color-accent-text);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sz-space-2);
		font-size: 0.875rem;
		color: var(--sz-color-muted);
	}

	.meta img {
		width: 1rem;
		height: 1rem;
	}

	.publisher {
		font-weight: var(--sz-font-weight-medium);
		color: var(--sz-color-muted);
		text-decoration: none;
	}

	.publisher:hover {
		color: var(--sz-color-ink);
		text-decoration: underline;
	}

	.summary {
		line-height: 1.65;
		color: var(--sz-color-muted);
	}

	.partners {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sz-space-2);
		padding-top: var(--sz-space-1);
	}

	.partners a {
		display: inline-flex;
		align-items: center;
		gap: var(--sz-space-1);
		padding: 0.125rem var(--sz-space-2);
		border: 1px solid var(--sz-color-border-soft);
		font-size: 0.75rem;
		font-weight: var(--sz-font-weight-medium);
		color: var(--sz-color-muted);
		text-decoration: none;
		transition:
			color var(--transition),
			border-color var(--transition);
	}

	.partners a:hover {
		border-color: var(--sz-color-border-accent);
		color: var(--sz-color-accent-text);
	}

	.partners img {
		width: 0.75rem;
		height: 0.75rem;
	}
</style>
