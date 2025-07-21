<script lang="ts">
  import { getFaviconUrl } from '$lib/utils/orgUtils.js';
  
  let { publications = [] } = $props();
    
  // Helper function to format date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }
</script>

<nav class="entry-list">
  <h2 class="section-header">Stories and investigations</h2>
  {#each publications as publication}
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
  {/each}
</nav>

<style>
  .section-header {
    font-family: 'Domine', serif;
    color: var(--text-light);
  }

  .entry {
    margin-bottom: 0.5em;
    display: block;
  }

  a.entry {
    transition: background-color 0.3s;
    padding: 1.5em;
    margin-left: -1em;
    margin-right: -1em;
    background-repeat: no-repeat;
    background-image: url(/media/icons/arrow-up-right.svg);
    background-position: 98% 95%;
    background-size: 0.8rem;
    border-radius: 1em;
    text-decoration: none;
    color: inherit;
  }

  a.entry:hover {
    background-color: var(--bg-entry-hover);
  }

  .entry h2 {
    font-size: 90%;
    font-weight: 550;
    color: var(--gray-800);
    margin: 0 0 0.3em 0;
  }

  .entry h2 + p {
    font-size: 0.9rem;
    color: var(--gray-600);
    margin: 0;
    line-height: 1.7;
  }

  .entry time {
    font-size: 90%;
    color: var(--gray-400);
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0.5em;
  }

  .portfolio-publication {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    opacity: 0.7;
  }

  /* Entry Partners (Also covered by) */
  .entry-partners {
    margin-top: -.4rem;
    margin-bottom: 1rem;
    padding: 0.25rem 1.5rem;
    background-color: var(--bg-partners);
    border-radius: 0 0 1rem 1rem;
    border-top: 1px solid var(--border-dark);
    margin-left: -1rem;
    margin-right: -1rem;
  }

  .entry-partners p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .portfolio-partner {
    margin-left: .5h2rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--gray-400);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .portfolio-partner:hover {
    color: var(--main-400);
  }

  /* Dark mode overrides */
  :global(.dark) .entry h2 {
    color: var(--text-light);
  }
</style>
