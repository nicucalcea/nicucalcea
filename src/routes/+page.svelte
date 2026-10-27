<script lang="ts">
	import Publication from '$lib/components/Publication.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Project from '$lib/components/Project.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import cvData from '$data/cv.json';
</script>

<svelte:head>
	<title>Nicu Calcea • Investigative Data Journalist</title>
	<meta
		name="description"
		content="Journalist and data analyst specializing in investigations, data-driven stories, and digital journalism. View my portfolio of published work and experience."
	/>
</svelte:head>

<Hero />

<div class="shell page">
	<div class="columns">
		<!-- Articles - 2/3 width on desktop -->
		<section class="stories">
			<h2 class="section-title">Selected stories and investigations</h2>
			<Publication publications={cvData.publications} featured={true} />
		</section>

		<!-- Work Experience + Education - 1/3 width on desktop -->
		<section>
			<h2 class="section-title">Work Experience</h2>
			<Experience experiences={cvData.work} featured={true} />

			<h2 class="section-title education">Education</h2>
			<Experience experiences={cvData.education} featured={true} />

			<div class="button-row cv-actions">
				<a href="/cv" class="btn-primary">Full CV</a>
				<a
					href="https://docs.google.com/document/d/1d8x_x-UUQOK3dj4j02eAL-neB_qqZFdcb-0i9iBYqSU/export?format=pdf"
					target="_blank"
					rel="noopener noreferrer"
					class="btn"
				>
					Download CV
				</a>
			</div>
		</section>
	</div>

	<!-- Projects Section -->
	<section class="projects">
		<h2 class="section-title">Projects</h2>
		<Project projects={cvData.projects} />
	</section>
</div>

<style>
	.columns {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--sz-space-5);
	}

	.education {
		margin-top: 3rem;
	}

	.cv-actions {
		margin-top: var(--sz-space-4);
	}

	.projects {
		margin-top: var(--sz-section-block-tight);
	}

	@media (min-width: 1024px) {
		.columns {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.stories {
			grid-column: span 2;
		}
	}
</style>
