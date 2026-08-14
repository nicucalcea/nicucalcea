<script lang="ts">
	import Publication from '$lib/components/Publication.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Project from '$lib/components/Project.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import cvData from '$data/cv.json';
</script>

<svelte:head>
	<title>Nicu Calcea • Investigative Data Journalist</title>
	<meta name="description" content="Journalist and data analyst specializing in investigations, data-driven stories, and digital journalism. View my portfolio of published work and experience." />
</svelte:head>

<Hero />

<div class="mx-auto max-w-[90rem] px-4 sm:px-6 py-[var(--sz-section-block)]">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Articles - 2/3 width on desktop -->
		<section class="lg:col-span-2">
			<h2 class="font-display text-2xl font-bold tracking-tight mb-6">Selected stories and investigations</h2>
			<Publication publications={cvData.publications} featured={true} />
		</section>

		<!-- Work Experience + Education - 1/3 width on desktop -->
		<section>
			<h2 class="font-display text-2xl font-bold tracking-tight mb-6">Work Experience</h2>
			<Experience experiences={cvData.work} featured={true} />
			
			<h2 class="font-display text-2xl font-bold tracking-tight mb-6 mt-12">Education</h2>
			<Experience experiences={cvData.education} featured={true} />
			
			<div class="flex flex-col sm:flex-row gap-3 mt-6">
				<a href="/cv" class="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] bg-primary text-primary-foreground hover:bg-[var(--sz-color-primary)] transition-colors">
					Full CV
				</a>
				<a href="https://docs.google.com/document/d/1d8x_x-UUQOK3dj4j02eAL-neB_qqZFdcb-0i9iBYqSU/export?format=pdf" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] border border-border text-foreground hover:bg-card transition-colors">
					Download CV
				</a>
			</div>
		</section>
	</div>

	<!-- Projects Section -->
	<section class="mt-[var(--sz-section-block)]">
		<h2 class="font-display text-2xl font-bold tracking-tight mb-6">Projects</h2>
		<Project projects={cvData.projects} />
	</section>
</div>