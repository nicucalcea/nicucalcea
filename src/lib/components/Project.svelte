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
	const filteredProjects = $derived(projects.filter((project) => (featured ? project.featured === true : true)));
</script>

<div class="projects">
	{#each filteredProjects as project}
		<article class="card card-interactive">
			<h3>
				<a href={project.url} target="_blank" rel="noopener noreferrer">
					<img src={getFavicon(project.url)} alt="" width="20" height="20" loading="lazy" />
					{project.name}
				</a>
			</h3>
			<p>{project.description}</p>
		</article>
	{/each}
</div>

<style>
	.projects {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--sz-space-4);
	}

	article {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: var(--sz-space-4);
	}

	h3 {
		font-size: 1rem;
	}

	h3 a {
		display: inline-flex;
		align-items: center;
		gap: var(--sz-space-2);
		color: var(--sz-color-ink);
		text-decoration: none;
		transition: color var(--transition);
	}

	h3 a:hover {
		color: var(--sz-color-accent-text);
	}

	h3 img {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	p {
		font-size: 0.875rem;
		line-height: 1.65;
		color: var(--sz-color-muted);
	}

	@media (min-width: 768px) {
		.projects {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.projects {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
