<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/work', label: 'Work' },
		{ href: '/cv', label: 'CV' }
	];
</script>

<header class="site-nav">
	<div class="shell nav-inner">
		<a href="/" class="wordmark">Nicu&nbsp;Calcea</a>

		<nav aria-label="Primary">
			{#each links as link}
				<a
					href={link.href}
					class="label nav-link"
					aria-current={page.url.pathname === link.href ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}

			<a href="https://samizdata.co/" target="_blank" rel="noopener noreferrer" class="btn-primary hire">
				Hire me
			</a>

			<ThemeToggle />
		</nav>
	</div>
</header>

<style>
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 40;
		border-bottom: 1px solid var(--sz-color-border-soft);
		background: var(--color-nav-surface);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sz-space-3);
		padding-block: var(--sz-space-3);
	}

	.wordmark {
		font-family: var(--sz-font-display);
		font-size: 1.125rem;
		font-weight: var(--sz-font-weight-display);
		letter-spacing: -0.04em;
		color: var(--sz-color-ink);
		text-decoration: none;
		transition: color var(--transition);
	}

	.wordmark:hover {
		color: var(--sz-color-accent-text);
	}

	nav {
		display: flex;
		align-items: center;
		gap: var(--sz-space-1);
	}

	.nav-link {
		padding: 0.75rem;
		color: var(--sz-color-ink-soft);
		text-decoration: none;
		transition: color var(--transition);
	}

	.nav-link:hover {
		color: var(--sz-color-accent-text-hover);
	}

	.nav-link[aria-current='page'] {
		color: var(--sz-color-accent-text);
	}

	.hire {
		margin-inline: var(--sz-space-2);
		padding-inline: 1rem;
	}

	@media (max-width: 479px) {
		.nav-inner {
			flex-wrap: wrap;
			row-gap: var(--sz-space-2);
			padding-block: var(--sz-space-2);
		}

		nav {
			width: 100%;
			justify-content: space-between;
		}

		.nav-link {
			padding-inline: 0.25rem;
		}

		.hire {
			margin-inline: 0;
		}
	}
</style>
