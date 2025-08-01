<script lang="ts">
	import Publication from '$lib/components/Publication.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Project from '$lib/components/Project.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Newspaper, FileUser, Download } from '@lucide/svelte';
	import cvData from '$data/cv.json';
</script>

<svelte:head>
	<title>Nicu Calcea • Investigative Data Journalist</title>
	<meta name="description" content="Journalist and data analyst specializing in investigations, data-driven stories, and digital journalism. View my portfolio of published work and experience." />
</svelte:head>

<!-- Hero Section -->
<Hero />

<div class="container mx-auto px-4 py-8">
	<main class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Articles - 2/3 width on desktop, full width on mobile -->
		<section class="lg:col-span-2 order-1">
			<h2 class="text-2xl font-semibold text-foreground mb-6">Stories and investigations</h2>
			<Publication publications={cvData.publications} featured={true} />
			
			<div class="flex justify-center mt-8">
				<Button href="/portfolio" variant="default">
					<Newspaper />
					See more stories
				</Button>
			</div>
		</section>

		<!-- Work Experience - 1/3 width on desktop, full width on mobile -->
		<section class="lg:col-span-1 order-2">
			<h2 class="text-2xl font-semibold text-foreground mb-6">Work Experience</h2>
			<Experience experiences={cvData.work} featured={true} />
			
			<h2 class="text-2xl font-semibold text-foreground mb-6 mt-12">Education</h2>
			<Experience experiences={cvData.education} featured={true} />
			
			<div class="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
				<Button href="/cv" variant="default">
					<FileUser />
					Full CV
				</Button>
				<Button href="https://docs.google.com/document/d/1d8x_x-UUQOK3dj4j02eAL-neB_qqZFdcb-0i9iBYqSU/export?format=pdf" variant="default" target="_blank" rel="noopener noreferrer">
					<Download />
					Download CV
				</Button>
			</div>
		</section>
	</main>

	<!-- Projects Section - Full width -->
	<section class="mt-12">
		<h2 class="text-2xl font-semibold text-foreground mb-6">Projects</h2>
		<Project projects={cvData.projects} />
	</section>
</div>
