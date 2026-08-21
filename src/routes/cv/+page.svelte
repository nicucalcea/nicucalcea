<script lang="ts">
	import Experience from '$lib/components/Experience.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import cvData from '$data/cv.json';
</script>

<svelte:head>
	<title>CV • Nicu Calcea</title>
	<meta name="description" content="Comprehensive CV and work experience of Nicu Calcea - journalist, data analyst, and digital storyteller." />
</svelte:head>

<div class="mx-auto max-w-[90rem] px-4 sm:px-6 py-[var(--sz-section-block)]">
	<header class="mb-[var(--sz-section-block)]">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
			<h1 class="font-display text-4xl font-black tracking-[-0.04em]">Work Experience</h1>
			<a href="https://docs.google.com/document/d/1d8x_x-UUQOK3dj4j02eAL-neB_qqZFdcb-0i9iBYqSU/export?format=pdf" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] border border-border text-foreground hover:border-[var(--sz-color-border-accent)] hover:text-[var(--sz-color-accent-text)] transition-colors">
				Download CV
			</a>
		</div>
	</header>

	<div class="space-y-[var(--sz-section-block)]">
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
			<h2 class="font-display text-2xl font-black tracking-[-0.04em] mb-6">Education</h2>
			<Experience experiences={cvData.education} />
		</section>
	</div>
</div>