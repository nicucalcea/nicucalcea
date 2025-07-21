<script>
  import { onMount } from 'svelte';
  import Box from './Box.svelte';

  onMount(() => {
    // Configure Substack widget
    Object.assign(window, {
      CustomSubstackWidget: {
        substackUrl: "samizdata.substack.com",
        placeholder: "Email address",
        buttonText: "Subscribe",
        theme: "custom",
        colors: {
          primary: "#52525b",
          input: "#27272a",
          email: "#a1a1a9",
          text: "#fff",
        },
      }
    });

    // Load Substack widget script
    const script = document.createElement('script');
    script.src = 'https://substackapi.com/widget.js';
    script.async = true;
    document.head.appendChild(script);
  });
</script>

<Box className="entry">
  <h2 class="flex">
    <img class="icon" alt="Email" width="24" height="24" src="/media/icons/brand-email.svg">
    <b>Stay up to date</b>
  </h2>

  <p>I write a newsletter about Eastern Europe, but I also share more details about personal projects there.</p>

  <div id="custom-substack-embed"></div>
</Box>

<style>
  .flex {
    align-items: center;
    display: flex;
    gap: 1em;
  }

  .icon {
    opacity: 0.6;
  }

  #custom-substack-embed {
    margin-top: 1em;
  }

  h2 {
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

  /* Dark mode overrides */
  :global(.dark) h2 {
    color: var(--text-light);
  }

  :global(.dark) .icon {
    filter: invert(1);
  }
</style>
