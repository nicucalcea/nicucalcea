<script>
  let { trainingUrl = '' } = $props();
</script>

<div class="banner">
  <p>Looking for data journalism training? <a href={trainingUrl}>Hire me</a>!</p>
</div>

<style>
  .banner {
    background: linear-gradient(135deg, var(--purple), var(--main-600));
    text-align: center;
    padding: 0.75rem 2rem;
    margin: -1.5rem -3rem 2rem -3rem;
    border-radius: 0;
    position: relative;
  }

  .banner p {
    margin: 0;
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
    max-width: none;
  }

  .banner a {
    color: white;
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.6);
    text-underline-offset: 2px;
    transition: text-decoration-color 0.2s ease;
  }

  .banner a:hover {
    text-decoration-color: white;
    -moz-text-decoration-color: white;
  }
</style>
