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

<section class="py-16 px-4">
	<div class="container mx-auto">
		<div class="flex flex-col lg:flex-row items-center gap-12">
			<!-- Left content -->
			<div class="flex-1 space-y-6">
				<div class="space-y-4">
					<h1 class="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
						{basics.label}
					</h1>
					
					<p class="text-lg text-muted-foreground leading-relaxed max-w-lg">
						{basics.summary}
					</p>
				</div>

				<!-- Social links -->
				<div class="flex flex-wrap gap-4 items-center">
					{#each basics.profiles as profile}
						<a 
							href={profile.url} 
							target="_blank" 
							rel="noopener noreferrer"
							class="flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground transition-colors duration-200"
							title={profile.network}
						>
							<svelte:component 
								this={getSocialIcon(profile.network)} 
								class="w-5 h-5"
							/>
							<span class="sr-only">{profile.network}</span>
						</a>
					{/each}
					
					<!-- Email link -->
					<a 
						href="/contact" 
						class="flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground transition-colors duration-200"
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
						class="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl object-cover shadow-lg"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
