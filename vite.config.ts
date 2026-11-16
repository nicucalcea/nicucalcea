import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({
				fallback: '404.html'
			}),
			// Inline the (small) stylesheets so first paint doesn't wait on extra
			// requests; the largest, global.css with the @font-face rules, is ~13 KB.
			inlineStyleThreshold: 20_000
		})
	]
});
