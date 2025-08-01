<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Mail, Linkedin } from '@lucide/svelte';

	onMount(() => {
		// Cal.com embed script - original working version with proper typing
		(function (C: any, A: string, L: string) { 
			let p = function (a: any, ar: any) { 
				a.q = a.q || [];
				a.q.push(ar); 
			}; 
			let d = C.document; 
			C.Cal = C.Cal || function () { 
				let cal = C.Cal; 
				let ar = arguments; 
				if (!cal.loaded) { 
					cal.ns = {}; 
					cal.q = cal.q || []; 
					d.head.appendChild(d.createElement("script")).src = A; 
					cal.loaded = true; 
				} 
				if (ar[0] === L) { 
					const api: any = function () { 
						p(api, arguments); 
					}; 
					const namespace = ar[1]; 
					// Initialize queue properly
					api.q = api.q || [];
					if(typeof namespace === "string"){
						cal.ns[namespace] = cal.ns[namespace] || api;
						p(cal.ns[namespace], ar);
						p(cal, ["initNamespace", namespace]);
					} else p(cal, ar); 
					return;
				} 
				p(cal, ar); 
			}; 
		})(window, "https://app.cal.com/embed/embed.js", "init");

		// Initialize Cal.com with proper typing
		(window as any).Cal("init", "30min", {origin:"https://app.cal.com"});

		(window as any).Cal.ns["30min"]("inline", {
			elementOrSelector:"#my-cal-inline-30min",
			config: {"layout":"month_view"},
			calLink: "nicucalcea/30min",
		});

		(window as any).Cal.ns["30min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
	});
</script>

<svelte:head>
	<title>Contact • Nicu Calcea</title>
	<meta name="description" content="Schedule a meeting or consultation. Book a 30-minute session to discuss your project or collaboration." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header Section -->
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
		<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
			Ready to discuss your idea or want to discuss training? Schedule a 30-minute meeting to explore how we can work together.
		</p>
	</div>

	<!-- Calendar Widget Section -->
	<div class="max-w-4xl mx-auto">
		<div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
			<div class="p-6 border-b border-border">
				<h2 class="text-2xl font-semibold text-card-foreground">Schedule a Meeting</h2>
				<p class="text-muted-foreground mt-2">
					Choose a convenient time for our conversation.
				</p>
			</div>
			
			<!-- Cal.com Widget Container -->
			<div class="bg-background">
				<div 
					id="my-cal-inline-30min" 
					class="w-full h-[600px] md:h-[700px] overflow-auto"
					style="width:100%;height:100%;overflow:scroll;min-height: 600px;"
				></div>
			</div>
		</div>
	</div>

	<!-- Additional Contact Information -->
	<div class="max-w-2xl mx-auto mt-12 text-center">
		<div class="bg-muted/50 rounded-lg p-6">
			<h3 class="text-xl font-semibold text-foreground mb-4">Prefer contacting me directly?</h3>
			<div class="space-y-4 text-muted-foreground">
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<Button href="mailto:website@nicu.md" size="lg">
						<Mail />
						Send me an email
					</Button>
					<Button href="https://www.linkedin.com/in/nicucalcea/" target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
						<Linkedin />
						Connect on LinkedIn
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>