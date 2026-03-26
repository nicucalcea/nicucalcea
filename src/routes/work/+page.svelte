<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import {
		getPublicationFilterQueryValue,
		matchesPublicationFilter,
		publicationFilterDefinitions,
		publicationHiddenFilterDefinitions,
		type PublicationFilterValues
	} from '$lib/config/publicationFilters';
	import Publication from '$lib/components/Publication.svelte';
	import PublicationFilter from '$lib/components/PublicationFilter.svelte';
	import cvData from '$data/cv.json';
	import type { Publication as PublicationEntry } from '$lib/types/publication';

	const filters = $derived.by(() => {
		const nextFilters: PublicationFilterValues = {};

		for (const definition of publicationFilterDefinitions) {
			nextFilters[definition.key] = getPublicationFilterQueryValue(page.url.searchParams, definition);
		}

		return nextFilters;
	});

	const hiddenFilteredPublications = $derived(() => {
		return cvData.publications.filter(publication => {
			return publicationHiddenFilterDefinitions.every(definition => {
				return matchesPublicationFilter(
					publication as PublicationEntry,
					definition,
					filters[definition.key] ?? ''
				);
			});
		});
	});

	const filteredPublications = $derived(() => {
		return hiddenFilteredPublications().filter(publication => {
			return (
				matchesPublicationFilter(
					publication as PublicationEntry,
					publicationFilterDefinitions.find(definition => definition.key === 'publisher')!,
					filters.publisher ?? ''
				) &&
				matchesPublicationFilter(
					publication as PublicationEntry,
					publicationFilterDefinitions.find(definition => definition.key === 'year')!,
					filters.year ?? ''
				)
			);
		});
	});

	function handleFilterChange(newFilters: { publisher: string; year: string }) {
		if (browser) {
			const url = new URL(page.url);
			if (newFilters.publisher) {
				url.searchParams.set('publisher', newFilters.publisher);
			} else {
				url.searchParams.delete('publisher');
			}
			url.searchParams.delete('publication');

			if (newFilters.year) {
				url.searchParams.set('year', newFilters.year);
			} else {
				url.searchParams.delete('year');
			}

			if (url.toString() !== page.url.toString()) {
				goto(url.toString(), { replaceState: true, noScroll: true, keepFocus: true });
			}
		}
	}
</script>

<svelte:head>
	<title>Work • Nicu Calcea</title>
	<meta name="description" content="Portfolio of published stories, investigations, and journalistic work by Nicu Calcea." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<header class="mb-12">
		<h1 class="text-4xl font-bold text-foreground mb-4">Stories and investigations</h1>
	</header>

	<main>
		<PublicationFilter 
			publications={hiddenFilteredPublications()} 
			onFilterChange={handleFilterChange}
			initialPublisher={filters.publisher}
			initialYear={filters.year}
		/>
		<Publication publications={filteredPublications()} featured={false} />
	</main>
</div>
