<script lang="ts">
	import '$src/styles/global.css';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to content</a>

<SiteNav />

<main id="main-content" tabindex="-1">
	{@render children()}
</main>

<SiteFooter />
