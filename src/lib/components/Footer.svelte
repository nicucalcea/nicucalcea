<script>
  let { name } = $props();
  
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <p>Copyright {currentYear}, {name} • Made with 💜 in London</p>
</footer>

<style>
  footer {
    border-top: 1px solid var(--gray-200);
    margin-top: 8em;
    text-align: center;
    padding: 2em 0;
  }

  footer p {
    font-size: 90%;
    opacity: 0.7;
    max-width: inherit;
    margin: 0;
    color: var(--gray-600);
  }

  /* Dark mode overrides */
  :global(.dark) footer {
    border-color: var(--border-dark);
  }

  @media (min-width: 768px) {
    footer {
      text-align: left;
    }
  }
</style>
