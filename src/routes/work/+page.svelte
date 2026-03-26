<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Publication from '$lib/components/Publication.svelte';
	import PublicationFilter from '$lib/components/PublicationFilter.svelte';
	import cvData from '$data/cv.json';
	import { onMount } from 'svelte';

	// State for filters
	let filters = $state({ publisher: "", year: "" });
	let tag = $state("");

	function syncFromUrl() {
		if (!browser) {
			return;
		}

		const url = new URL(window.location.href);
		const nextPublisher = url.searchParams.get('publication') ?? "";
		const nextYear = url.searchParams.get('year') ?? "";
		const nextTag = url.searchParams.get('tag') ?? "";

		if (filters.publisher !== nextPublisher || filters.year !== nextYear) {
			filters = { publisher: nextPublisher, year: nextYear };
		}

		if (tag !== nextTag) {
			tag = nextTag;
		}
	}

	onMount(() => {
		syncFromUrl();
	});

	afterNavigate(() => {
		syncFromUrl();
	});

	const tagFilteredPublications = $derived(() => {
		const activeTag = tag;

		if (!activeTag) {
			return cvData.publications;
		}

		return cvData.publications.filter(pub => pub.tags?.includes(activeTag));
	});

	// Filter the publications based on current filters
	const filteredPublications = $derived(() => {
		return tagFilteredPublications().filter(pub => {
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
		if (browser) {
			const url = new URL(window.location.href);
			const currentPublication = url.searchParams.get('publication') ?? "";
			const currentYear = url.searchParams.get('year') ?? "";

			if (
				currentPublication === newFilters.publisher &&
				currentYear === newFilters.year
			) {
				filters = newFilters;
				return;
			}
			
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
			publications={tagFilteredPublications()} 
			onFilterChange={handleFilterChange}
			initialPublisher={filters.publisher}
			initialYear={filters.year}
		/>
		<Publication publications={filteredPublications()} featured={false} />
	</main>
</div>
