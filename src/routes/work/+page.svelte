<script lang="ts">
	import Publication from '$lib/components/Publication.svelte';
	import PublicationFilter from '$lib/components/PublicationFilter.svelte';
	import cvData from '$data/cv.json';

	// State for filters
	let filters = $state({ publisher: "", year: "" });

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

	// Handle filter changes
	function handleFilterChange(newFilters: { publisher: string; year: string }) {
		filters = newFilters;
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
		/>
		<Publication publications={filteredPublications()} featured={false} />
	</main>
</div>
