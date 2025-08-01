<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
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
		publications
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
		<Card class="transition-shadow hover:shadow-md gap-3">
			<CardHeader>
				<CardTitle>
					<a
						href={publication.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:text-primary/80 hover:underline"
					>
						{publication.name}
					</a>
				</CardTitle>
				<CardDescription>
					{#if publication.publisher}
						<div class="flex items-center gap-2">
							<img 
								src={getFavicon(publication.url)} 
								alt="" 
								class="w-4 h-4 flex-shrink-0"
								loading="lazy"
							/>
							<span class="font-medium">{publication.publisher}</span>
							<span>• {formatDate(publication.releaseDate)}</span>
						</div>
					{:else}
						{formatDate(publication.releaseDate)}
					{/if}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{#if publication.summary}
					<p class="text-foreground">{publication.summary}</p>
				{/if}
			</CardContent>
			{#if publication.partners && publication.partners.length > 0}
				<CardFooter>
					<div class="w-full">
						<div class="flex flex-wrap items-center gap-2">
							<span class="text-sm font-medium text-muted-foreground">Also published by:</span>
							{#each publication.partners as partner}
								<Badge variant="outline">
									<a
										href={partner.url}
										target="_blank"
										rel="noopener noreferrer"
										class="hover:underline flex items-center gap-1.5"
									>
										<img 
											src={getFavicon(partner.url)} 
											alt="" 
											class="w-3 h-3 flex-shrink-0"
											loading="lazy"
										/>
										{partner.name}
									</a>
								</Badge>
							{/each}
						</div>
					</div>
				</CardFooter>
			{/if}
		</Card>
	{/each}
</div>