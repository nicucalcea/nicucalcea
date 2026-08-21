<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Cal.com embed script
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

<div class="mx-auto max-w-[90rem] px-4 sm:px-6 py-[var(--sz-section-block)]">
	<!-- Header Section -->
	<div class="text-center mb-12">
		<p class="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--sz-color-accent-text)] mb-4">Get in touch</p>
		<h1 class="font-display text-4xl sm:text-5xl font-black tracking-[-0.04em] mb-4">Let&rsquo;s talk</h1>
		<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
			Ready to discuss an investigation, commission a data story, or want to discuss training? Schedule a 30-minute meeting.
		</p>
	</div>

	<!-- Calendar Widget Section -->
	<div class="max-w-4xl mx-auto">
		<div class="border border-border bg-card">
			<div class="p-6 border-b border-border">
				<h2 class="font-display text-xl font-black tracking-[-0.04em]">Schedule a Meeting</h2>
				<p class="text-muted-foreground mt-2">
					Choose a convenient time for our conversation.
				</p>
			</div>
			
			<div class="bg-background">
				<div 
					id="my-cal-inline-30min" 
					class="w-full h-[600px] md:h-[700px] overflow-auto"
					style="width:100%;height:100%;overflow:scroll;min-height: 500px;"
				></div>
			</div>
		</div>
	</div>

	<!-- Additional Contact Information -->
	<div class="max-w-2xl mx-auto mt-12 text-center">
		<div class="border border-border bg-card p-8">
			<h3 class="font-display text-lg font-black tracking-[-0.04em] mb-4">Prefer contacting me directly?</h3>
			<div class="space-y-4 text-muted-foreground">
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<a href="mailto:website@nicu.md" class="inline-flex items-center justify-center gap-2 px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.18em] bg-primary text-primary-foreground hover:bg-[var(--sz-color-primary)] transition-colors">
						Send me an email
					</a>
					<a href="https://www.linkedin.com/in/nicucalcea/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.18em] border border-border text-foreground hover:border-[var(--sz-color-border-accent)] hover:text-[var(--sz-color-accent-text)] transition-colors">
						Connect on LinkedIn
					</a>
				</div>
			</div>
		</div>
	</div>
</div>