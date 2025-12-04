<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Publication from '$lib/components/Publication.svelte';
	import PublicationFilter from '$lib/components/PublicationFilter.svelte';
	import cvData from '$data/cv.json';

	// State for filters
	let filters = $state({ publisher: "", year: "" });
	
	// Read URL parameters only in browser (not during prerendering)
	$effect(() => {
		if (browser) {
			const url = new URL(window.location.href);
			const publisher = url.searchParams.get('publication') ?? "";
			const year = url.searchParams.get('year') ?? "";
			filters = { publisher, year };
		}
	});

	// Filter the publications based on current filters
	const filteredPublications = $derived(() => {
		return cvData.publications.filter(pub => {
			// Filter by publisher
			if (filters.publisher && pub.publisher !== filters.publisher) {
				return false;
			}
			
			// Filter by year
			if (filters.year) {
				const pubYear = new Date(pub.releaseDate).getFullYear().toString();
				if (pubYear !== filters.year) {
					return false;
				}
			}
			
			return true;
		});
	});

	// Handle filter changes and update URL
	function handleFilterChange(newFilters: { publisher: string; year: string }) {
		filters = newFilters;
		
		// Update URL query parameters
		if (browser) {
			const url = new URL(window.location.href);
			
			if (newFilters.publisher) {
				url.searchParams.set('publication', newFilters.publisher);
			} else {
				url.searchParams.delete('publication');
			}
			
			if (newFilters.year) {
				url.searchParams.set('year', newFilters.year);
			} else {
				url.searchParams.delete('year');
			}
			
			// Use replaceState to avoid adding to browser history for each filter change
			goto(url.toString(), { replaceState: true, noScroll: true, keepFocus: true });
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
			publications={cvData.publications} 
			onFilterChange={handleFilterChange}
			initialPublisher={filters.publisher}
			initialYear={filters.year}
		/>
		<Publication publications={filteredPublications()} featured={false} />
	</main>
</div>
