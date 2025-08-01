<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { page } from '$app/stores';
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon } from '@lucide/svelte';
	
	$: currentPath = $page.url.pathname;
</script>

<section class="px-4">
	<div class="container mx-auto">
		<div class="flex items-center justify-between py-4">
			<NavigationMenu.Root>
				<NavigationMenu.List class="flex items-center space-x-1">
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/" class="px-3 py-2 text-sm font-medium transition-colors rounded-md {currentPath === '/' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}">
							Home
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/portfolio" class="px-3 py-2 text-sm font-medium transition-colors rounded-md {currentPath === '/portfolio' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}">
							Portfolio
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					
					<NavigationMenu.Item>
						<NavigationMenu.Link href="https://training.nicu.md/" target="_blank" rel="noopener noreferrer" class="px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors !flex !flex-row !items-center !gap-2">
							<span>Training</span>
							<img src="/icons/arrow-up-right.svg" alt="" class="w-3 h-3 brightness-0 invert-[0.4] dark:invert-[0.8]" />
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/cv" class="px-3 py-2 text-sm font-medium transition-colors rounded-md {currentPath === '/cv' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}">
							CV
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/contact" class="px-3 py-2 text-sm font-medium transition-colors rounded-md {currentPath === '/contact' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}">
							Contact
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
			
			<!-- Dark Mode Toggle - positioned at far right -->
			<button
				onclick={toggleMode}
				class="relative p-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
				aria-label="Toggle dark mode"
			>
				<Moon class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Sun class="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			</button>
		</div>
	</div>
</section>
