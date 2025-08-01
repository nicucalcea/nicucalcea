<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { getFavicon } from '$lib/utils/getIcon.js';

	interface Project {
		name: string;
		startDate: string;
		endDate: string;
		description: string;
		highlights: string[];
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
		<Card class="transition-shadow hover:shadow-md h-full flex flex-col">
			<CardHeader>
				<CardTitle>
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:text-primary/80 hover:underline flex items-center gap-2"
					>
						<img 
							src={getFavicon(project.url)} 
							alt="" 
							class="w-5 h-5 flex-shrink-0"
							loading="lazy"
						/>
						{project.name}
					</a>
				</CardTitle>
			</CardHeader>
			<CardContent class="flex-grow">
				<p class="text-foreground">{project.description}</p>
			</CardContent>
		</Card>
	{/each}
</div>
