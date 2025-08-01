<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import { tick } from "svelte";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	interface Publication {
		name: string;
		publisher?: string;
		releaseDate: string;
		url: string;
		summary?: string;
		partners?: Array<{
			name: string;
			url: string;
		}>;
		featured?: boolean;
	}

	interface Props {
		publications: Publication[];
		onFilterChange: (filters: { publisher: string; year: string }) => void;
	}

	let { publications, onFilterChange }: Props = $props();

	// Extract unique publishers and years
	const publishers = $derived(() => {
		// Create a map to track the most recent publication date for each publisher
		const publisherDates = new Map<string, Date>();
		
		publications.forEach(pub => {
			if (pub.publisher) {
				const pubDate = new Date(pub.releaseDate);
				const existingDate = publisherDates.get(pub.publisher);
				if (!existingDate || pubDate > existingDate) {
					publisherDates.set(pub.publisher, pubDate);
				}
			}
		});
		
		// Sort publishers by their most recent publication date (newest first)
		return Array.from(publisherDates.keys()).sort((a, b) => {
			const dateA = publisherDates.get(a)!;
			const dateB = publisherDates.get(b)!;
			return dateB.getTime() - dateA.getTime();
		});
	});

	const years = $derived(() => {
		const uniqueYears = new Set<string>();
		publications.forEach(pub => {
			const year = new Date(pub.releaseDate).getFullYear().toString();
			uniqueYears.add(year);
		});
		return Array.from(uniqueYears).sort((a, b) => parseInt(b) - parseInt(a));
	});

	// State for filters
	let selectedPublisher = $state("");
	let selectedYear = $state("");

	// State for comboboxes
	let publisherOpen = $state(false);
	let yearOpen = $state(false);
	let publisherTriggerRef = $state<HTMLButtonElement>(null!);
	let yearTriggerRef = $state<HTMLButtonElement>(null!);

	// Derived values for display
	const selectedPublisherLabel = $derived(
		publishers().find(p => p === selectedPublisher) || ""
	);
	const selectedYearLabel = $derived(
		years().find(y => y === selectedYear) || ""
	);

	// Functions to close and focus trigger
	function closePublisherAndFocus() {
		publisherOpen = false;
		tick().then(() => {
			publisherTriggerRef?.focus();
		});
	}

	function closeYearAndFocus() {
		yearOpen = false;
		tick().then(() => {
			yearTriggerRef?.focus();
		});
	}

	// Function to clear filters
	function clearFilters() {
		selectedPublisher = "";
		selectedYear = "";
		onFilterChange({ publisher: "", year: "" });
	}

	// Watch for changes and notify parent
	$effect(() => {
		onFilterChange({ publisher: selectedPublisher, year: selectedYear });
	});
</script>

<div class="mb-8">
	<div class="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
		<div class="flex flex-col sm:flex-row gap-4">
			<!-- Publisher Filter -->
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-foreground" for="publisher-filter">
					Filter by publisher
				</label>
				<Popover.Root bind:open={publisherOpen}>
					<Popover.Trigger bind:ref={publisherTriggerRef}>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="w-full sm:w-[240px] justify-between"
								{...props}
								role="combobox"
								aria-expanded={publisherOpen}
							>
								{selectedPublisherLabel || "All publishers"}
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-[240px] p-0">
						<Command.Root>
							<Command.Input placeholder="Search publishers..." />
							<Command.List>
								<Command.Empty>No publisher found.</Command.Empty>
								<Command.Group>
									<Command.Item
										value=""
										onSelect={() => {
											selectedPublisher = "";
											closePublisherAndFocus();
										}}
									>
										<CheckIcon
											class={cn(
												"mr-2 size-4",
												selectedPublisher !== "" && "text-transparent"
											)}
										/>
										All publishers
									</Command.Item>
									{#each publishers() as publisher}
										<Command.Item
											value={publisher}
											onSelect={() => {
												selectedPublisher = publisher;
												closePublisherAndFocus();
											}}
										>
											<CheckIcon
												class={cn(
													"mr-2 size-4",
													selectedPublisher !== publisher && "text-transparent"
												)}
											/>
											{publisher}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>

			<!-- Year Filter -->
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-foreground" for="year-filter">
					Filter by year
				</label>
				<Popover.Root bind:open={yearOpen}>
					<Popover.Trigger bind:ref={yearTriggerRef}>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="w-full sm:w-[160px] justify-between"
								{...props}
								role="combobox"
								aria-expanded={yearOpen}
							>
								{selectedYearLabel || "All years"}
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-[160px] p-0">
						<Command.Root>
							<Command.Input placeholder="Search years..." />
							<Command.List>
								<Command.Empty>No year found.</Command.Empty>
								<Command.Group>
									<Command.Item
										value=""
										onSelect={() => {
											selectedYear = "";
											closeYearAndFocus();
										}}
									>
										<CheckIcon
											class={cn(
												"mr-2 size-4",
												selectedYear !== "" && "text-transparent"
											)}
										/>
										All years
									</Command.Item>
									{#each years() as year}
										<Command.Item
											value={year}
											onSelect={() => {
												selectedYear = year;
												closeYearAndFocus();
											}}
										>
											<CheckIcon
												class={cn(
													"mr-2 size-4",
													selectedYear !== year && "text-transparent"
												)}
											/>
											{year}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>

		<!-- Clear Filters Button -->
		{#if selectedPublisher || selectedYear}
			<Button variant="ghost" size="sm" onclick={clearFilters} class="self-start sm:self-end">
				Clear filters
			</Button>
		{/if}
	</div>

	<!-- Results count and active filters -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground">
		<div>
			Showing {publications.length} {publications.length === 1 ? 'publication' : 'publications'}
			{#if selectedPublisher || selectedYear}
				<span class="ml-1">
					filtered by
					{#if selectedPublisher}
						<span class="font-medium text-foreground">{selectedPublisher}</span>
					{/if}
					{#if selectedPublisher && selectedYear}
						<span> and </span>
					{/if}
					{#if selectedYear}
						<span class="font-medium text-foreground">{selectedYear}</span>
					{/if}
				</span>
			{/if}
		</div>
	</div>
</div>
