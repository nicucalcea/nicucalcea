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
	const margin = { top: 80, right: 40, bottom: 80, left: 80 };
	
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

	// SAMIZDATA chart colour palette
	// Work: raspberry accent as leading series, then categorical
	const workColors = [
		'var(--sz-chart-accent, #9f1853)',   // Leading series
		'var(--sz-chart-categorical-2, #28666e)',
		'var(--sz-chart-categorical-3, #c26d3a)',
		'var(--sz-chart-categorical-4, #60569b)',
		'var(--sz-chart-categorical-5, #67823a)',
		'var(--sz-chart-categorical-6, #a64b37)',
		'var(--sz-chart-categorical-7, #397c8c)',
		'var(--sz-chart-categorical-8, #8a6075)',
	];

	// Education: muted sequential tones
	const educationColors = [
		'var(--sz-chart-sequential-5, #ad3267)',
		'var(--sz-chart-sequential-6, #8b0c48)',
		'var(--sz-chart-sequential-7, #5d002e)',
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

<div class="w-full border border-border bg-card p-6 relative" bind:this={containerElement}>
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
						stroke="currentColor" 
						stroke-width="2"
						class="text-muted-foreground"
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
								stroke="currentColor" 
								stroke-width="1"
								class="text-muted-foreground"
							/>
							<text 
								x={x} 
								y={plotHeight / 2 + 20} 
								text-anchor="middle" 
								font-size={chartWidth < 600 ? "10" : "12"} 
								fill="currentColor"
								class="font-medium text-muted-foreground"
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
							<path 
								d={path} 
								fill="none" 
								stroke={color} 
								stroke-width={chartWidth < 600 ? "4" : "6"} 
								stroke-linecap="round"
								transform={`translate(0, ${plotHeight / 2})`}
								class="transition-opacity hover:opacity-80 cursor-pointer"
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
									fill="var(--sz-chart-accent, #9f1853)"
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
							<path 
								d={path} 
								fill="none" 
								stroke={color} 
								stroke-width={chartWidth < 600 ? "4" : "6"} 
								stroke-linecap="round"
								transform={`translate(0, ${plotHeight / 2}) scale(1, -1)`}
								class="transition-opacity hover:opacity-80 cursor-pointer"
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
						x="-20" 
						y={plotHeight / 2 - 40} 
						text-anchor="middle" 
						font-size={chartWidth < 600 ? "12" : "14"} 
						font-weight="600"
						fill="currentColor"
						class="font-semibold text-muted-foreground"
					>
						Work
					</text>
					<text 
						x="-20" 
						y={plotHeight / 2 + 50} 
						text-anchor="middle" 
						font-size={chartWidth < 600 ? "12" : "14"} 
						font-weight="600"
						fill="currentColor"
						class="font-semibold text-muted-foreground"
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
				class="fixed z-50 bg-popover text-popover-foreground text-sm p-3 shadow-sm pointer-events-none max-w-xs border border-border"
				style="display: none;"
			>
				<div class="font-display font-bold text-base mb-1">{exp.name}</div>
				<div class="text-muted-foreground mb-2">{exp.position}</div>
				<div class="text-xs text-muted-foreground mb-2">
					{formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
					{#if exp.isCurrent}
						<span class="ml-2 text-[var(--sz-color-accent-text)]">● Current</span>
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
				class="fixed z-50 bg-popover text-popover-foreground text-sm p-3 shadow-sm pointer-events-none max-w-xs border border-border"
				style="display: none;"
			>
				<div class="font-display font-bold text-base mb-1">{edu.institution}</div>
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
	{/if}
</div>