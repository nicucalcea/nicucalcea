<script lang="ts">
	import cvData from '$data/cv.json';
	import { Github, Linkedin, Reddit, Globe, BookFill, Bluesky, EnvelopeFill, Mastodon } from 'svelte-bootstrap-icons';

	const { basics } = cvData;

	// Map social network names to Bootstrap icons
	function getSocialIcon(network: string) {
		switch (network.toLowerCase()) {
			case 'github':
				return Github;
			case 'linkedin':
				return Linkedin;
			case 'reddit':
				return Reddit;
			case 'goodreads':
				return BookFill;
			case 'mastodon':
				return Mastodon;
			case 'bluesky':
				return Bluesky;
			default:
				return Globe;
		}
	}
</script>

<section class="hero">
	<div class="grid-pattern" aria-hidden="true"></div>
	<div class="shell hero-inner">
		<div class="copy">
			<h1>{basics.label}</h1>

			<p class="summary">{basics.summary}</p>

			<div class="socials">
				{#each basics.profiles as profile}
					{@const SocialIcon = getSocialIcon(profile.network)}
					<a href={profile.url} target="_blank" rel="noopener noreferrer" title={profile.network}>
						<SocialIcon width={20} height={20} />
						<span class="sr-only">{profile.network}</span>
					</a>
				{/each}

				<a href="/contact" title="Contact">
					<EnvelopeFill width={20} height={20} />
					<span class="sr-only">Contact</span>
				</a>
			</div>
		</div>

		<img class="portrait" src={basics.image} alt={basics.name} width="320" height="320" />
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		border-bottom: 1px solid var(--sz-color-border-soft);
	}

	.grid-pattern {
		position: absolute;
		inset: 0;
		opacity: 0.1;
		background-image:
			linear-gradient(var(--sz-color-outline) 1px, transparent 1px),
			linear-gradient(90deg, var(--sz-color-outline) 1px, transparent 1px);
		background-size: 2.5rem 2.5rem;
		pointer-events: none;
	}

	.hero-inner {
		position: relative;
		display: flex;
		align-items: center;
		gap: 3rem;
		padding-block: var(--sz-section-block-tight);
	}

	.copy {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--sz-space-4);
	}

	h1 {
		font-size: clamp(2.25rem, 6vw, 3.75rem);
	}

	.summary {
		max-width: 32rem;
		font-size: 1.125rem;
		line-height: 1.65;
		color: var(--sz-color-muted);
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.socials a {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--sz-color-border-soft);
		background: var(--sz-color-surface-lowest);
		color: var(--sz-color-muted);
		transition:
			color var(--transition),
			border-color var(--transition);
	}

	.socials a:hover {
		border-color: var(--sz-color-border-accent);
		color: var(--sz-color-accent-text);
	}

	.portrait {
		display: none;
		flex-shrink: 0;
		width: 20rem;
		height: 20rem;
		object-fit: cover;
	}

	@media (min-width: 1024px) {
		.portrait {
			display: block;
		}
	}
</style>
