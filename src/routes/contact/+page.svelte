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

<div class="shell page">
	<!-- Header Section -->
	<header>
		<p class="label eyebrow">Get in touch</p>
		<h1 class="page-title">Let&rsquo;s talk</h1>
		<p class="intro">
			Ready to discuss an investigation, commission a data story, or want to discuss training? Schedule a 30-minute
			meeting.
		</p>
	</header>

	<!-- Calendar Widget Section -->
	<div class="card calendar-card">
		<div class="calendar-header">
			<h2>Schedule a Meeting</h2>
			<p class="muted">Choose a convenient time for our conversation.</p>
		</div>
		<!-- The size is reserved on a wrapper: Cal's element inherits min-height from its parent -->
		<div class="calendar">
			<div id="my-cal-inline-30min"></div>
		</div>
	</div>

	<!-- Additional Contact Information -->
	<div class="card direct">
		<h3>Prefer contacting me directly?</h3>
		<div class="button-row">
			<a href="mailto:website@nicu.md" class="btn-primary">Send me an email</a>
			<a href="https://www.linkedin.com/in/nicucalcea/" target="_blank" rel="noopener noreferrer" class="btn">
				Connect on LinkedIn
			</a>
		</div>
	</div>
</div>

<style>
	header {
		max-width: 42rem;
		margin: 0 auto 3rem;
		text-align: center;
	}

	.eyebrow {
		margin-bottom: var(--sz-space-3);
		color: var(--sz-color-accent-text);
	}

	.page-title {
		margin-bottom: var(--sz-space-3);
	}

	.intro {
		font-size: 1.125rem;
		color: var(--sz-color-muted);
	}

	.calendar-card {
		container-type: inline-size;
		max-width: 56rem;
		margin: 0 auto;
	}

	.calendar-header {
		padding: var(--sz-space-4);
		border-bottom: 1px solid var(--sz-color-border-soft);
	}

	.calendar-header h2 {
		margin-bottom: var(--sz-space-2);
		font-size: 1.25rem;
	}

	/*
		Reserve the Cal.com embed's final height so it doesn't push the page
		down when it loads (measured: its month view stacks below 768px wide
		and grows with width; at 768px and up it sits side by side at 534px).
	 */
	.calendar {
		width: 100%;
		min-height: calc(568px + 84.75cqi);
		overflow: auto;
		background: var(--sz-color-surface);
	}

	@container (min-width: 768px) {
		.calendar {
			min-height: 534px;
		}
	}

	/* Cal's skeleton loader reflows as it fills in; show the embed once ready */
	.calendar :global(cal-inline:not([loading='done'])) {
		visibility: hidden;
	}

	.direct {
		max-width: 42rem;
		margin: 3rem auto 0;
		padding: var(--sz-space-5);
		text-align: center;
	}

	.direct h3 {
		margin-bottom: var(--sz-space-3);
		font-size: 1.125rem;
	}

	.direct .button-row {
		justify-content: center;
	}
</style>
