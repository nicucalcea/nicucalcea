<script lang="ts">
	import '$src/app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { ModeWatcher } from 'mode-watcher';
	
	let { children } = $props();
</script>

<ModeWatcher />

<Navigation />

<main>
	{@render children()}
</main>

<Footer />