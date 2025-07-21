<script>
  let { children, className = '', padding = true } = $props();
</script>

<div class="box {className}" class:no-padding={!padding}>
  {@render children()}
</div>

<style>
  .box {
    width: 100%;
    border-radius: 8px;
    border: 1px solid var(--gray-200);
    margin-bottom: 1rem;
    padding: 2em;
  }

  .box.no-padding {
    padding: 0;
  }

  /* Dark mode overrides */
  :global(.dark) .box {
    border-color: var(--border-dark);
  }
</style>
