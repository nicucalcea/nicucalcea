<script>
  import Box from './Box.svelte';
  
  let { githubUsername } = $props();
</script>

<Box className="entry" padding={false}>
  <a href="https://github.com/{githubUsername}/" target="_blank">
    <img
      src="https://github-readme-stats-sigma-steel-31.vercel.app/api/top-langs/?username={githubUsername}&custom_title=Top%20languages%20(personal GitHub)&card_width=320&bg_color=18181b&title_color=f4f4f5&text_color=a1a1a9&show_icons=true&hide_border=true&hide=html,css,scss&size_weight=0.5&count_weight=0.5"
      width="100%"
      loading="lazy"
      alt="GitHub Language Stats"
    />
  </a>
</Box>

<style>
  a {
    display: block;
    text-decoration: none;
  }

  img {
    width: 100%;
    border-radius: 8px;
  }
</style>
