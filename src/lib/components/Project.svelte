<script lang="ts">
	import { getFavicon } from '$lib/utils/getIcon.js';

	interface Project {
		name: string;
		startDate: string;
		endDate: string;
		description: string;
		highlights?: string[];
		url: string;
		featured?: boolean;
	}

	interface Props {
		projects: Project[];
		featured?: boolean;
	}

	let { projects, featured = false }: Props = $props();

	// Optionally filter to only featured projects
	const filteredProjects = $derived(
		projects.filter(project => featured ? project.featured === true : true)
	);
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each filteredProjects as project}
		<article class="border border-border bg-card p-6 flex flex-col h-full">
			<h3 class="font-display text-base font-bold mb-3">
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-foreground hover:text-[var(--sz-color-accent-text)] transition-colors inline-flex items-center gap-2"
				>
					<img
						src={getFavicon(project.url)}
						alt=""
						class="w-5 h-5 flex-shrink-0"
						loading="lazy"
					/>
					{project.name}
				</a>
			</h3>
			<p class="text-foreground text-sm leading-relaxed flex-grow">{project.description}</p>
		</article>
	{/each}
</div>