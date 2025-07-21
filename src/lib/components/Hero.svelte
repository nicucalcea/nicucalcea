<script>
  let { basics } = $props();
</script>

<section class="hero">
  <div class="hero-left">
    <header>
      <h1>{basics.label}</h1>
      <p>{basics.summary}</p>
    </header>

    <nav>
      {#each basics.profiles as profile}
        <a href={profile.url} target="_blank">
          <img class="icon" width="30" height="30" src="/media/icons/brand-{profile.network.toLowerCase()}.svg" alt={profile.network}>
        </a>
      {/each}
    </nav>
  </div>

  <img class="avatar" alt="Avatar" width="64" height="64" src="/media/profile-square.jpg">
</section>

<style>
  .hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .hero-left {
    flex-grow: 1;
  }

  .hero nav {
    margin: 1.5em 0 3em 0;
  }

  .avatar {
    width: 15rem;
    height: 15rem;
    border-radius: 1em;
    float: left;
    margin-left: 1em;
  }

  h1 {
    font-family: 'Domine', serif;
    font-size: 3rem;
    font-weight: 720;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--text-light);
    max-width: 12em;
    margin-bottom: 0.5em;
  }

  p {
    line-height: 1.7;
    max-width: 38em;
    margin: 0;
    color: var(--gray-600);
  }

  strong {
    color: white;
  }

  nav {
    display: flex;
    gap: 1.5em;
  }

  .icon {
    opacity: 0.6;
    filter: invert();
  }

  a .icon:hover {
    opacity: 0.8;
  }

  @media (max-width: 1024px) {
    .avatar {
      display: none;
    }
  }
</style>
