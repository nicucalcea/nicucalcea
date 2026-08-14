<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import { page } from "$app/stores";
  import { toggleMode } from "mode-watcher";
  import { Sun, Moon } from "@lucide/svelte";

  $: currentPath = $page.url.pathname;

  const links = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/cv", label: "CV" }
  ];
</script>

<header class="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
  <div class="mx-auto max-w-[90rem] px-4 sm:px-6">
    <div class="flex items-center justify-between py-4">
      <!-- Wordmark -->
      <a
        href="/"
        class="font-display text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors"
      >
        Nicu&nbsp;Calcea
      </a>

      <nav class="flex items-center gap-1">
        {#each links as link}
          <a
            href={link.href}
            class="px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors {currentPath ===
            link.href
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'}"
          >
            {link.label}
          </a>
        {/each}

        <a
          href="https://samizdata.co/"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] bg-primary text-primary-foreground hover:bg-[var(--sz-color-primary)] transition-colors"
        >
          Hire me
        </a>

        <!-- Dark Mode Toggle -->
        <button
          onclick={toggleMode}
          class="relative ml-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle dark mode"
        >
          <Moon
            class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Sun
            class="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
        </button>
      </nav>
    </div>
  </div>
</header>