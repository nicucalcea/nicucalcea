<script lang="ts">
	type WorkExperience = {
		name: string;
		position: string;
		url?: string;
		startDate: string;
		endDate: string;
		summary?: string;
		highlights?: string[];
	};

	type Education = {
		institution: string;
		area: string;
		studyType: string;
		url?: string;
		startDate: string;
		endDate: string;
		score?: string;
		courses?: string[];
	};

	type Props = {
		experiences: WorkExperience[];
		education: Education[];
	};

	let { experiences, education }: Props = $props();

	// Process data and calculate timeline
	const processedData = $derived.by(() => {
		// Process work experiences
		const validExperiences = experiences
			.filter(exp => exp.startDate && exp.startDate !== '')
			.map(exp => ({
				...exp,
				startDate: new Date(exp.startDate),
				endDate: exp.endDate && exp.endDate !== '' ? new Date(exp.endDate) : new Date(),
				isCurrent: !exp.endDate || exp.endDate === '',
				type: 'work' as const
			}))
			.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

		// Process education data
		const validEducation = education
			.filter(edu => edu.startDate && edu.startDate !== '')
			.map(edu => ({
				...edu,
				startDate: new Date(edu.startDate),
				endDate: edu.endDate && edu.endDate !== '' ? new Date(edu.endDate) : new Date(),
				isCurrent: !edu.endDate || edu.endDate === '',
				type: 'education' as const
			}))
			.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

		// Combine all items for timeline calculation
		const allItems = [...validExperiences, ...validEducation];
		
		if (allItems.length === 0) return { 
			experiences: [], 
			education: [], 
			minDate: new Date(), 
			maxDate: new Date(), 
			dateRange: 0 
		};

		const minDate = new Date(Math.min(...allItems.map(item => item.startDate.getTime())));
		const maxDate = new Date(Math.max(...allItems.map(item => item.endDate.getTime())));
		const dateRange = maxDate.getTime() - minDate.getTime();

		return {
			experiences: validExperiences,
			education: validEducation,
			minDate,
			maxDate,
			dateRange
		};
	});

	// Chart dimensions - responsive
	let containerElement: HTMLDivElement;
	let containerWidth = $state(800); // Default width
	
	const baseWidth = 800;
	const chartHeight = 300;
	const margin = { top: 80, right: 40, bottom: 80, left: 40 };
	
	// Reactive dimensions based on container width
	const chartWidth = $derived(Math.max(320, containerWidth)); // Minimum 320px width
	const plotWidth = $derived(chartWidth - margin.left - margin.right);
	const plotHeight = chartHeight - margin.top - margin.bottom;

	// Update container width on resize
	$effect(() => {
		if (typeof window !== 'undefined' && containerElement) {
			const updateWidth = () => {
				containerWidth = containerElement.offsetWidth || baseWidth;
			};
			
			updateWidth();
			window.addEventListener('resize', updateWidth);
			
			return () => {
				window.removeEventListener('resize', updateWidth);
			};
		}
	});

	// Color palette for the arches
	const workColors = [
		'#0ea5e9', // sky-500
		'#06b6d4', // cyan-500
		'#10b981', // emerald-500
		'#84cc16', // lime-500
		'#eab308', // yellow-500
		'#f97316', // orange-500
		'#ef4444', // red-500
		'#ec4899', // pink-500
		'#a855f7', // purple-500
		'#6366f1'  // indigo-500
	];

	const educationColors = [
		'#94a3b8', // slate-400
		'#71717a', // zinc-500
		'#6b7280', // gray-500
		'#78716c', // stone-500
		'#92400e', // amber-800
		'#b45309', // amber-700
		'#dc2626', // red-600
		'#c2410c', // orange-700
		'#7c2d12', // orange-900
		'#365314'  // lime-800
	];

	function getDatePosition(date: Date, minDate: Date, dateRange: number): number {
		if (dateRange === 0) return plotWidth / 2;
		return (date.getTime() - minDate.getTime()) / dateRange * plotWidth;
	}

	function createArchPath(startDate: Date, endDate: Date, minDate: Date, dateRange: number): string {
		const startX = getDatePosition(startDate, minDate, dateRange);
		const endX = getDatePosition(endDate, minDate, dateRange);
		const width = endX - startX;
		
		// Create an elliptical arch that sits on the x-axis
		const radiusX = width / 2;
		const radiusY = Math.min(60, Math.max(20, width * 0.4)); // Dynamic height based on duration
		
		if (width < 2) {
			// For very short durations, draw a small semicircle
			const centerX = (startX + endX) / 2;
			return `M ${centerX - 3} 0 A 3 15 0 0 1 ${centerX + 3} 0`;
		}
		
		return `M ${startX} 0 A ${radiusX} ${radiusY} 0 0 1 ${endX} 0`;
	}

	function getYearLabels(minDate: Date, maxDate: Date): number[] {
		const minYear = minDate.getFullYear();
		const maxYear = maxDate.getFullYear();
		const labels = [];
		const step = Math.max(1, Math.ceil((maxYear - minYear) / 10));
		
		for (let year = minYear; year <= maxYear; year += step) {
			labels.push(year);
		}
		
		// Always include the max year if it's not already there
		if (labels[labels.length - 1] !== maxYear) {
			labels.push(maxYear);
		}
		
		return labels;
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short'
		});
	}
</script>

<div class="w-full bg-secondary p-6 rounded-lg relative" bind:this={containerElement}>
	<h2 class="text-2xl font-bold text-foreground mb-6 text-center">Career Timeline</h2>
	
	{#if processedData.experiences.length === 0 && processedData.education.length === 0}
		<p class="text-center text-muted-foreground">No valid experience or education data available</p>
	{:else}
		<div class="w-full">
			<svg 
				width="100%" 
				height={chartHeight} 
				viewBox={`0 0 ${chartWidth} ${chartHeight}`}
				preserveAspectRatio="xMidYMid meet"
				class="max-w-full h-auto"
			>
				<g transform={`translate(${margin.left}, ${margin.top})`}>
					<!-- Timeline axis -->
					<line 
						x1="0" 
						y1={plotHeight / 2} 
						x2={plotWidth} 
						y2={plotHeight / 2} 
						stroke="#374151" 
						stroke-width="2"
					/>
					
					<!-- Year labels -->
					{#each getYearLabels(processedData.minDate, processedData.maxDate) as year}
						{@const x = getDatePosition(new Date(year, 0, 1), processedData.minDate, processedData.dateRange)}
						<g>
							<line 
								x1={x} 
								y1={plotHeight / 2 - 5} 
								x2={x} 
								y2={plotHeight / 2 + 5} 
								stroke="#374151" 
								stroke-width="1"
							/>
							<text 
								x={x} 
								y={plotHeight / 2 + 20} 
								text-anchor="middle" 
								font-size={chartWidth < 600 ? "10" : "12"} 
								fill="#374151"
								class="font-medium"
							>
								{year}
							</text>
						</g>
					{/each}
					
					<!-- Work Experience arches (above axis) -->
					{#each processedData.experiences as exp, i}
						{@const color = workColors[i % workColors.length]}
						{@const path = createArchPath(
							exp.startDate, 
							exp.endDate, 
							processedData.minDate, 
							processedData.dateRange
						)}
						{@const tooltipId = `tooltip-work-${i}`}
						
						<g>
							<!-- Arch path with tooltip -->
							<path 
								d={path} 
								fill="none" 
								stroke={color} 
								stroke-width={chartWidth < 600 ? "4" : "6"} 
								stroke-linecap="round"
								transform={`translate(0, ${plotHeight / 2})`}
								class="drop-shadow-sm hover:stroke-8 cursor-pointer transition-all duration-200"
								role="button"
								tabindex="0"
								aria-label={`${exp.name} - ${exp.position} (${exp.startDate.getFullYear()} - ${exp.isCurrent ? 'Present' : exp.endDate.getFullYear()})`}
								onmouseenter={(e) => {
									const tooltip = document.getElementById(tooltipId);
									if (tooltip) {
										tooltip.style.display = 'block';
										tooltip.style.left = e.clientX + 10 + 'px';
										tooltip.style.top = e.clientY - 10 + 'px';
									}
								}}
								onmouseleave={() => {
									const tooltip = document.getElementById(tooltipId);
									if (tooltip) {
										tooltip.style.display = 'none';
									}
								}}
								onmousemove={(e) => {
									const tooltip = document.getElementById(tooltipId);
									if (tooltip) {
										tooltip.style.left = e.clientX + 10 + 'px';
										tooltip.style.top = e.clientY - 10 + 'px';
									}
								}}
							/>
							
							<!-- Current position indicator -->
							{#if exp.isCurrent}
								{@const endX = getDatePosition(exp.endDate, processedData.minDate, processedData.dateRange)}
								<circle 
									cx={endX} 
									cy={plotHeight / 2} 
									r="4" 
									fill="#10b981"
									class="animate-pulse"
								/>
							{/if}
						</g>
					{/each}
					
					<!-- Education arches (below axis) -->
					{#each processedData.education as edu, i}
						{@const color = educationColors[i % educationColors.length]}
						{@const path = createArchPath(
							edu.startDate, 
							edu.endDate, 
							processedData.minDate, 
							processedData.dateRange
						)}
						{@const tooltipId = `tooltip-edu-${i}`}
						
						<g>
							<!-- Arch path with tooltip -->
							<path 
								d={path} 
								fill="none" 
								stroke={color} 
								stroke-width={chartWidth < 600 ? "4" : "6"} 
								stroke-linecap="round"
								transform={`translate(0, ${plotHeight / 2}) scale(1, -1)`}
								class="drop-shadow-sm hover:stroke-8 cursor-pointer transition-all duration-200"
								role="button"
								tabindex="0"
								aria-label={`${edu.institution} - ${edu.studyType} in ${edu.area} (${edu.startDate.getFullYear()} - ${edu.endDate.getFullYear()})`}
								onmouseenter={(e) => {
									const tooltip = document.getElementById(tooltipId);
									if (tooltip) {
										tooltip.style.display = 'block';
										tooltip.style.left = e.clientX + 10 + 'px';
										tooltip.style.top = e.clientY - 10 + 'px';
									}
								}}
								onmouseleave={() => {
									const tooltip = document.getElementById(tooltipId);
									if (tooltip) {
										tooltip.style.display = 'none';
									}
								}}
								onmousemove={(e) => {
									const tooltip = document.getElementById(tooltipId);
									if (tooltip) {
										tooltip.style.left = e.clientX + 10 + 'px';
										tooltip.style.top = e.clientY - 10 + 'px';
									}
								}}
							/>
						</g>
					{/each}
					
					<!-- Labels for sections -->
					<text 
						x="-30" 
						y={plotHeight / 2 - 40} 
						text-anchor="middle" 
						font-size={chartWidth < 600 ? "12" : "14"} 
						font-weight="600"
						fill="#374151"
						class="font-semibold"
					>
						Work
					</text>
					<text 
						x="-30" 
						y={plotHeight / 2 + 50} 
						text-anchor="middle" 
						font-size={chartWidth < 600 ? "12" : "14"} 
						font-weight="600"
						fill="#374151"
						class="font-semibold"
					>
						Education
					</text>
				</g>
			</svg>
		</div>
		
		<!-- Tooltips for Work Experience -->
		{#each processedData.experiences as exp, i}
			<div 
				id={`tooltip-work-${i}`}
				class="fixed z-50 bg-popover text-popover-foreground text-sm rounded-lg p-3 shadow-lg pointer-events-none max-w-xs border border-border"
				style="display: none;"
			>
				<div class="font-semibold text-base mb-1">{exp.name}</div>
				<div class="text-muted-foreground mb-2">{exp.position}</div>
				<div class="text-xs text-muted-foreground mb-2">
					{formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
					{#if exp.isCurrent}
						<span class="ml-2 text-emerald-400">● Current</span>
					{/if}
				</div>
				{#if exp.summary}
					<div class="text-xs text-muted-foreground leading-relaxed">{exp.summary.length > 150 ? exp.summary.substring(0, 150) + '...' : exp.summary}
					</div>
				{/if}
			</div>
		{/each}
		
		<!-- Tooltips for Education -->
		{#each processedData.education as edu, i}
			<div 
				id={`tooltip-edu-${i}`}
				class="fixed z-50 bg-popover text-popover-foreground text-sm rounded-lg p-3 shadow-lg pointer-events-none max-w-xs border border-border"
				style="display: none;"
			>
				<div class="font-semibold text-base mb-1">{edu.institution}</div>
				<div class="text-muted-foreground mb-2">{edu.studyType} in {edu.area}</div>
				<div class="text-xs text-muted-foreground mb-2">
					{formatDate(edu.startDate)} - {formatDate(edu.endDate)}
				</div>
				{#if edu.score}
					<div class="text-xs text-muted-foreground leading-relaxed">
						Score: {edu.score}
					</div>
				{/if}
			</div>
		{/each}
		
		<!-- Legend -->
		<div class="mt-6 text-center">
			<div class="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
					<span>Work Experience</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-gray-500 rounded-full"></div>
					<span>Education</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
					<span>Current Position</span>
				</div>
				<span class="text-muted-foreground/50 hidden sm:inline">|</span>
				<span class="hidden sm:inline">Hover over arches for details</span>
				<span class="text-muted-foreground/50 hidden sm:inline">|</span>
				<span class="text-xs">Timeline: {processedData.minDate.getFullYear()} - {processedData.maxDate.getFullYear()}</span>
			</div>
		</div>
	{/if}
</div>
