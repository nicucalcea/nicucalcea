<script lang="ts">
	import cvData from '$data/cv.json';
	import {
		Github,
		Linkedin,
		Reddit,
		Globe,
		BookFill,
		Bluesky,
		EnvelopeFill,
		Mastodon,
		Threads
	} from 'svelte-bootstrap-icons';

	const { basics } = cvData;

	// Map social network names to Bootstrap icons
	function getSocialIcon(network: string) {
		const networkLower = network.toLowerCase();
		switch (networkLower) {
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

<section class="border-b border-border">
	<div class="mx-auto max-w-[90rem] px-4 sm:px-6 py-[var(--sz-section-block)]">
		<div class="flex flex-col lg:flex-row items-center gap-12">
			<!-- Left content -->
			<div class="flex-1 space-y-6">
				<p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sz-color-accent-text)]">
					Investigative data journalism
				</p>

				<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[0.95]">
					{basics.label}
				</h1>

				<p class="text-lg text-muted-foreground leading-relaxed max-w-lg">
					{basics.summary}
				</p>

				<!-- Social links -->
				<div class="flex flex-wrap gap-3 items-center">
					{#each basics.profiles as profile}
						<a
							href={profile.url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center w-11 h-11 border border-border bg-card text-muted-foreground hover:text-[var(--sz-color-accent-text)] hover:border-[var(--sz-color-border-accent)] transition-colors"
							title={profile.network}
						>
							<svelte:component this={getSocialIcon(profile.network)} class="w-5 h-5" />
							<span class="sr-only">{profile.network}</span>
						</a>
					{/each}

					<!-- Email link -->
					<a
						href="/contact"
						class="flex items-center justify-center w-11 h-11 border border-border bg-card text-muted-foreground hover:text-[var(--sz-color-accent-text)] hover:border-[var(--sz-color-border-accent)] transition-colors"
						title="Contact"
					>
						<EnvelopeFill class="w-5 h-5" />
						<span class="sr-only">Contact</span>
					</a>
				</div>
			</div>

			<!-- Right content - Profile image -->
			<div class="flex-shrink-0 hidden lg:block">
				<div class="relative">
					<img
						src={basics.image}
						alt={basics.name}
						class="w-64 h-64 lg:w-80 lg:h-80 object-cover"
					/>
				</div>
			</div>
		</div>
	</div>
</section>