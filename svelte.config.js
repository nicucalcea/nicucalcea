import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		// Since you're using a custom domain, you don't need the BASE_PATH
		// If you want to test with the repo path, uncomment the paths config below
		// paths: {
		// 	base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		// },
		alias: {
			$data: 'src/data',
			$src: 'src'
		}
	}
};

export default config;
