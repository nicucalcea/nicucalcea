<script lang="ts">
	// SAMIZDATA brand fonts, self-hosted: Space Grotesk 700 (display; the
	// family tops out at 700) + Work Sans 400/500 (body).
	import '@fontsource/space-grotesk/700.css';
	import '@fontsource/work-sans/400.css';
	import '@fontsource/work-sans/500.css';
	import spaceGrotesk700 from '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url';
	import workSans400 from '@fontsource/work-sans/files/work-sans-latin-400-normal.woff2?url';
	import '../styles/global.css';
	import SiteNav from '#lib/components/SiteNav.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" href={workSans400} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={spaceGrotesk700} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

<SiteNav />

<main id="main-content" tabindex="-1">
	{@render children()}
</main>

<SiteFooter />
