<script>
  let { projects = [] } = $props();
  
  // Helper function to get favicon URL
  function getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`;
    } catch {
      return '/media/icons/robot.svg'; // fallback icon
    }
  }
  
  // Helper function to get project icon
  function getProjectIcon(project) {
    if (project.name === 'Augmenta') return '/media/icons/robot.svg';
    if (project.name === 'Ra11y') return '/media/icons/accessible.svg';
    if (project.name === 'dataproofr') return 'https://avatars.githubusercontent.com/u/16234738';
    if (project.url) return getFaviconUrl(project.url);
    return '/media/icons/robot.svg';
  }
</script>

<section class="projects">
  <h2 class="section-header">Projects</h2>
  <ul>
    {#each projects as project}
      <li>
        <a class="entry" href={project.url} target="_blank">
          <img src={getProjectIcon(project)} alt={project.name}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style>
  .section-header {
    font-family: 'Domine', serif;
    color: var(--text-light);
  }

  .projects ul {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    list-style: none;
    display: grid;
    max-width: 55em;
    gap: 4em;
    margin-top: 3em;
    padding: 0;
  }

  .projects ul .entry {
    margin: 0;
    padding: 1.5rem;
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .projects ul p {
    max-width: 16em;
    line-height: 1.7;
    color: var(--gray-600);
    margin: 0;
  }

  .projects ul img {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1em;
  }

  .projects ul .icon {
    opacity: 0.6;
  }

  .projects ul a {
    background-repeat: no-repeat;
    background-image: url(/media/icons/arrow-up-right.svg);
    background-position: 95% 95%;
    background-size: 0.8rem;
    padding-right: 1.4em;
    font-size: 90%;
    color: var(--gray-400);
    transition: color 0.2s ease;
  }

  .projects ul a:hover {
    background-color: #333;
    border-radius: 1rem;
    transition: background-color 0.3s;
  }

  .projects ul h2 {
    font-size: 90%;
    font-weight: 550;
    color: var(--gray-800);
    margin: 0 0 0.5em 0;
  }

  /* Dark mode overrides */
  :global(.dark) .projects ul h2 {
    color: var(--text-light);
  }
</style>
