<script lang="ts">
  import { getFaviconUrl } from '$lib/utils/orgUtils.js';
  
  let { data } = $props();
  const { cv } = data;
    
  // Helper function to format date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }
</script>

<svelte:head>
  <title>Stories and Investigations - Nicu Calcea</title>
  <meta name="description" content="Complete portfolio of investigative stories and data journalism by Nicu Calcea" />
</svelte:head>

<main>
  <div class="container">
    <header class="page-header">
      <h1>Stories and Investigations</h1>
      <p class="page-description">
        A complete portfolio of investigative stories and data journalism work.
      </p>
    </header>

    <nav class="entry-list">
      {#each cv.publications as publication}
        <article class="entry-wrapper">
          <a class="entry" href={publication.url} target="_blank">
            <time>
              <img class="portfolio-publication" src={getFaviconUrl(publication.url)} alt={publication.publisher}>
              {publication.publisher} • {formatDate(publication.releaseDate)}
            </time>
            <div>
              <h2>{publication.name}</h2>
              <p>{publication.summary}</p>
            </div>
          </a>
          {#if publication.partners && publication.partners.length > 0}
            <div class="entry-partners">
              <p>Also covered by: 
                {#each publication.partners as partner, index}
                  <a class="portfolio-partner" href={partner.url} target="_blank">
                    <img class="portfolio-publication" src={getFaviconUrl(partner.url)} alt={partner.name}>
                    {partner.name}
                  </a>{#if index < publication.partners.length - 1}&nbsp;{/if}
                {/each}
              </p>
            </div>
          {/if}
        </article>
      {/each}
    </nav>
  </div>
</main>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .page-header {
    margin-bottom: 3rem;
    text-align: center;
  }

  .page-header h1 {
    font-family: 'Domine', serif;
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  .page-description {
    font-size: 1.1rem;
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .entry-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .entry-wrapper {
    display: block;
  }

  .entry {
    display: block;
    transition: background-color 0.3s;
    padding: 1.5rem;
    background-repeat: no-repeat;
    background-image: url(/media/icons/arrow-up-right.svg);
    background-position: 98% 95%;
    background-size: 0.8rem;
    border-radius: 1rem;
    text-decoration: none;
    color: inherit;
    border: 1px solid var(--border-light);
  }

  .entry:hover {
    background-color: var(--bg-entry-hover);
    border-color: var(--border-hover);
  }

  .entry h2 {
    font-size: 1.1rem;
    font-weight: 550;
    color: var(--gray-800);
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }

  .entry h2 + p {
    font-size: 0.95rem;
    color: var(--gray-600);
    margin: 0;
    line-height: 1.6;
  }

  .entry time {
    font-size: 0.9rem;
    color: var(--gray-400);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-weight: 500;
  }

  .portfolio-publication {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    opacity: 0.8;
  }

  /* Entry Partners (Also covered by) */
  .entry-partners {
    margin-top: -1rem;
    margin-bottom: 0;
    padding: 1rem 1.5rem;
    background-color: var(--bg-partners);
    border-radius: 0 0 1rem 1rem;
    border: 1px solid var(--border-light);
    border-top: none;
  }

  .entry-partners p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .portfolio-partner {
    margin-left: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--gray-500);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .portfolio-partner:hover {
    color: var(--main-400);
  }

  /* Dark mode overrides */
  :global(.dark) .page-header h1 {
    color: var(--text-light);
  }

  :global(.dark) .entry {
    border-color: var(--border-dark);
  }

  :global(.dark) .entry:hover {
    border-color: var(--border-hover);
  }

  :global(.dark) .entry h2 {
    color: var(--text-light);
  }

  :global(.dark) .entry-partners {
    border-color: var(--border-dark);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .entry {
      padding: 1.25rem;
    }

    .entry h2 {
      font-size: 1rem;
    }
  }
</style>
