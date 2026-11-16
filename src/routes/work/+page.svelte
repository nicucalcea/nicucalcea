<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { browser } from '$app/env';
	import Publication from '#lib/components/Publication.svelte';
	import PublicationFilter from '#lib/components/PublicationFilter.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

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

	// Over a thousand cards take ~500 ms to hydrate in one go, blocking input.
	// Prerender and hydrate the first batch, then render the rest in small
	// batches, each in its own task so the page stays responsive.
	const INITIAL_CARDS = 40;
	const CARDS_PER_BATCH = 100;
	let cardLimit = $state(INITIAL_CARDS);

	onMount(() => {
		syncFromUrl();

		let timer: ReturnType<typeof setTimeout>;
		const renderMore = () => {
			cardLimit += CARDS_PER_BATCH;
			if (cardLimit < data.publications.length) timer = setTimeout(renderMore);
		};
		timer = setTimeout(renderMore);
		return () => clearTimeout(timer);
	});

	afterNavigate(() => {
		syncFromUrl();
	});

	const tagFilteredPublications = $derived(() => {
		const activeTag = tag;

		if (!activeTag) {
			return data.publications;
		}

		return data.publications.filter(pub => pub.tags?.includes(activeTag));
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
			
			// Replace the history entry (no new entry per filter change), keeping scroll and focus
			goto(url.toString(), { replace: true, reset: false });
		}

		filters = newFilters;
	}
</script>

<svelte:head>
	<title>Work • Nicu Calcea</title>
	<meta name="description" content="Portfolio of published stories, investigations, and journalistic work by Nicu Calcea." />
</svelte:head>

<div class="shell page">
	<header>
		<h1 class="page-title">Stories and investigations</h1>
	</header>

	<PublicationFilter
		publications={tagFilteredPublications()}
		onFilterChange={handleFilterChange}
		initialPublisher={filters.publisher}
		initialYear={filters.year}
		resultCount={filteredPublications().length}
	/>
	<!-- Publications arrive sorted newest first, so the first batch is the latest -->
	<Publication publications={filteredPublications().slice(0, cardLimit)} headingLevel={2} />
</div>

<style>
	header {
		margin-bottom: var(--sz-section-block-tight);
	}
</style>
