<script lang="ts" module>
	// Inline Lucide icon set (ISC-licensed paths), matching the samizdata.co
	// website's Icon component. No icon dependency needed.
	const paths = {
		'chevron-down': '<path d="m6 9 6 6 6-6"/>',
		'chevron-left': '<path d="m15 18-6-6 6-6"/>',
		'chevron-right': '<path d="m9 18 6-6-6-6"/>',
		moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
		sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
	};

	export type IconName = keyof typeof paths;
</script>

<script lang="ts">
	interface Props {
		name: IconName;
		size?: number;
		strokeWidth?: number;
		class?: string;
	}

	let { name, size = 24, strokeWidth = 2, class: className = '' }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	class={className}
>
	{@html paths[name]}
</svg>
