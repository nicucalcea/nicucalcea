<script>
  import { getOrgImage } from '$lib/utils/orgUtils.js';
  import Box from './Box.svelte';
  
  let { work = [], education = [] } = $props();
  
  // Helper function to format date range
  /**
   * @param {string} startDate
   * @param {string} endDate
   */
  function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (!endDate) {
      return `${startFormatted} – Present`;
    }
    
    const end = new Date(endDate);
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    return `${startFormatted} – ${endFormatted}`;
  }
</script>

<Box className="entry">
  <h2 class="flex">
    <img class="icon" alt="Case" width="24" height="24" src="/media/icons/briefcase.svg">
    <b>Work</b>
  </h2>
  <ul>
    {#each work as job}
      <li class="flex">
        <figure>
          <img class="brand" src={getOrgImage(job.name, job.url)} alt={job.name} width="38" height="38">
        </figure>
        <div>
          <h3>{job.name} — {job.position}</h3>
          <p>{formatDateRange(job.startDate, job.endDate)}</p>
        </div>
      </li>
    {/each}
  </ul>

  <h2 class="flex">
    <img class="icon" alt="School" width="24" height="24" src="/media/icons/school.svg">
    <b>Education</b>
  </h2>
  <ul>
    {#each education as edu}
      <li class="flex">
        <figure>
          <img class="brand" src={getOrgImage(edu.institution, edu.url)} alt={edu.institution} width="38" height="38">
        </figure>
        <div>
          <h3>{edu.institution} — {edu.studyType} in {edu.area}</h3>
          <p>{formatDateRange(edu.startDate, edu.endDate)}</p>
        </div>
      </li>
    {/each}
  </ul>

  <a href="https://docs.google.com/document/d/1d8x_x-UUQOK3dj4j02eAL-neB_qqZFdcb-0i9iBYqSU/export?format=pdf" target="_blank" download>
    <button class="secondary">
      Download CV as PDF
      <img src="/media/icons/arrow-down.svg" alt="Download">
    </button>
  </a>
</Box>

<style>
  .flex {
    align-items: center;
    display: flex;
    gap: 1em;
  }

  li.flex {
    align-items: flex-start;
  }

  .flex b {
    font-family: 'Domine', serif;
  }

  .icon {
    opacity: 0.6;
  }

  h2, h3 {
    color: var(--gray-800);
    margin-bottom: 0.3em;
    font-family: 'Domine', serif;
    font-size: 90%;
    font-weight: 550;
  }

  p {
    font-size: 85%;
    line-height: 1.7;
    max-width: 38em;
    margin: 0;
    color: var(--gray-600);
  }

  ul {
    margin: 1.5em 0 2em;
    padding: 0;
    list-style: none;
  }

  li {
    margin-bottom: 1.5em;
  }

  figure {
    margin: 0;
    max-width: 2.8em;
    flex-shrink: 0;
  }

  .brand {
    box-shadow: 0 1px 3px #777;
    border: 2px solid black;
    border-radius: 1.4em;
    width: 2.4em;
    height: 2.4em;
    object-fit: cover;
    background-color: white;
    padding: 0.2em;
    flex-shrink: 0;
  }

  /* Specific styling for favicon images */
  .brand[src*="gstatic.com"] {
    padding: 0.2em;
    background-color: white;
  }

  button {
    font-size: 85%;
    font-weight: 550;
    text-align: center;
    color: var(--text-light);
    padding: 0.75em 1.8em;
    border-radius: 4px;
    background-color: var(--gray-600);
    border: 1px solid var(--gray-600);
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    background-color: #333;
  }

  button:active {
    transform: translateY(1px);
  }

  .secondary {
    white-space: nowrap;
    color: var(--white-off);
    background-color: var(--gray-50);
  }

  .secondary:hover {
    background-color: var(--gray-100);
  }

  .secondary img {
    max-width: 1.2em;
    float: right;
    color: aliceblue;
  }

  /* Dark mode overrides */
  :global(.dark) h2,
  :global(.dark) h3 {
    color: var(--text-light);
  }

  :global(.dark) .icon {
    filter: invert(1);
  }

  :global(.dark) .secondary {
    background-color: var(--gray-800);
    border: 1px solid var(--gray-800);
  }
</style>
