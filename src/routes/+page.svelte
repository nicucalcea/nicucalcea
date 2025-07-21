<script>
  import Banner from '$lib/components/Banner.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Stories from '$lib/components/Stories.svelte';
  import Newsletter from '$lib/components/Newsletter.svelte';
  import WorkEducation from '$lib/components/WorkEducation.svelte';
  import GitHubStats from '$lib/components/GitHubStats.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { data } = $props();
  const { cv } = data;
  
  // Get GitHub username from profiles
  const githubProfile = cv.basics.profiles.find(p => p.network === 'GitHub');
  const githubUsername = githubProfile ? githubProfile.username : 'nicucalcea';
</script>

<svelte:head>
  <title>{cv.basics.name} • {cv.basics.label}</title>
  <meta name="description" content={cv.basics.summary}>
  <meta property="og:title" content="{cv.basics.name} - {cv.basics.label} in {cv.basics.location.city}">
  <meta property="og:description" content={cv.basics.summary}>
</svelte:head>

<Banner trainingUrl="https://training.nicu.md/" />

<main>
  <Hero basics={cv.basics} />

  <aside>
    <Stories publications={cv.publications} />
    
    <Newsletter />
    
    <WorkEducation work={cv.work} education={cv.education} />
    
    <GitHubStats githubUsername={githubUsername} />
  </aside>

  <Projects projects={cv.projects} />
</main>

<Footer name={cv.basics.name} />