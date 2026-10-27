<script lang="ts">
	import Experience from '$lib/components/Experience.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import cvData from '$data/cv.json';
</script>

<svelte:head>
	<title>CV • Nicu Calcea</title>
	<meta
		name="description"
		content="Comprehensive CV and work experience of Nicu Calcea - journalist, data analyst, and digital storyteller."
	/>
</svelte:head>

<div class="shell page">
	<header>
		<h1 class="page-title">Work Experience</h1>
		<a
			href="https://docs.google.com/document/d/1d8x_x-UUQOK3dj4j02eAL-neB_qqZFdcb-0i9iBYqSU/export?format=pdf"
			target="_blank"
			rel="noopener noreferrer"
			class="btn"
		>
			Download CV
		</a>
	</header>

	<div class="sections">
		<!-- Timeline Chart -->
		<section>
			<Timeline experiences={cvData.work} education={cvData.education} />
		</section>

		<!-- Detailed Experience List -->
		<section>
			<Experience experiences={cvData.work} />
		</section>

		<!-- Education Section -->
		<section>
			<h2 class="section-title">Education</h2>
			<Experience experiences={cvData.education} />
		</section>
	</div>
</div>

<style>
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sz-space-3);
		margin-bottom: var(--sz-section-block-tight);
	}

	.sections {
		display: grid;
		gap: var(--sz-section-block-tight);
	}
</style>
