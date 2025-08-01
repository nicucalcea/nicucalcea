<script lang="ts">
	import Experience from '$lib/components/Experience.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Download } from '@lucide/svelte';
	import cvData from '$data/cv.json';
</script>

<svelte:head>
	<title>CV • Nicu Calcea</title>
	<meta name="description" content="Comprehensive CV and work experience of Nicu Calcea - journalist, data analyst, and digital storyteller." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<header class="mb-12">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
			<h1 class="text-4xl font-bold text-foreground">Work Experience</h1>
			<Button href="https://docs.google.com/document/d/1d8x_x-UUQOK3dj4j02eAL-neB_qqZFdcb-0i9iBYqSU/export?format=pdf" variant="default" target="_blank" rel="noopener noreferrer">
				<Download />
				Download CV
			</Button>
		</div>
	</header>

	<main class="space-y-12">
		<!-- Timeline Chart -->
		<section class="hidden md:block">
			<Timeline experiences={cvData.work} education={cvData.education} />
		</section>
		
		<!-- Detailed Experience List -->
		<section>
			<Experience experiences={cvData.work} />
		</section>

		<!-- Education Section -->
		<section>
			<h2 class="text-2xl font-semibold text-foreground mb-6">Education</h2>
			<Experience experiences={cvData.education} />
		</section>
	</main>
</div>
