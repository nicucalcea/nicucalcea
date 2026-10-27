<script lang="ts">
	// Theme toggle — reads/writes the shared `samizdata-theme` key and the
	// `data-theme` attribute on <html> (set before paint in app.html).
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	let theme = $state<'light' | 'dark'>('light');

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('samizdata-theme', theme);
		} catch {
			/* private mode */
		}
	}
</script>

<button
	type="button"
	class="theme-toggle"
	aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	onclick={toggle}
>
	<Icon name="sun" size={18} strokeWidth={2.2} class="icon-sun" />
	<Icon name="moon" size={18} strokeWidth={2.2} class="icon-moon" />
</button>

<style>
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		padding: 0;
		border: 1px solid var(--sz-color-border-soft);
		border-radius: var(--sz-radius-full);
		background: var(--sz-color-surface-lowest);
		color: var(--sz-color-ink-soft);
		cursor: pointer;
		transition:
			color var(--transition),
			border-color var(--transition),
			background-color var(--transition);
	}
	.theme-toggle:hover {
		color: var(--sz-color-accent-text);
		border-color: var(--sz-color-border-accent);
		background: var(--sz-color-surface-high);
	}
	.theme-toggle :global(.icon-sun) {
		display: none;
	}
	:global(html[data-theme='dark']) .theme-toggle :global(.icon-sun) {
		display: block;
	}
	:global(html[data-theme='dark']) .theme-toggle :global(.icon-moon) {
		display: none;
	}
</style>
