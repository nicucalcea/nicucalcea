import type { Publication } from '$lib/types/publication';

export type PublicationFilterMode = 'value' | 'year';
export type PublicationFilterSort = 'alpha' | 'desc' | 'recent';
export type PublicationFilterValues = Record<string, string>;

export interface PublicationFilterDefinition {
	key: string;
	field?: keyof Publication;
	label: string;
	allLabel: string;
	ui: boolean;
	mode: PublicationFilterMode;
	optionSort: PublicationFilterSort;
	searchPlaceholder: string;
	emptyLabel: string;
	widthClass: string;
	aliases?: string[];
}

export const publicationFilterDefinitions: PublicationFilterDefinition[] = [
	{
		key: 'publisher',
		field: 'publisher',
		label: 'publisher',
		allLabel: 'All publishers',
		ui: true,
		mode: 'value',
		optionSort: 'recent',
		searchPlaceholder: 'Search publishers...',
		emptyLabel: 'No publisher found.',
		widthClass: 'sm:w-[240px]',
		aliases: ['publication']
	},
	{
		key: 'year',
		field: 'releaseDate',
		label: 'year',
		allLabel: 'All years',
		ui: true,
		mode: 'year',
		optionSort: 'desc',
		searchPlaceholder: 'Search years...',
		emptyLabel: 'No year found.',
		widthClass: 'sm:w-[160px]'
	},
	{
		key: 'tags',
		field: 'tags',
		label: 'tag',
		allLabel: 'All tags',
		ui: false,
		mode: 'value',
		optionSort: 'alpha',
		searchPlaceholder: 'Search tags...',
		emptyLabel: 'No tag found.',
		widthClass: 'sm:w-[200px]',
		aliases: ['tag']
	},
	{
		key: 'category',
		field: 'category',
		label: 'category',
		allLabel: 'All categories',
		ui: false,
		mode: 'value',
		optionSort: 'alpha',
		searchPlaceholder: 'Search categories...',
		emptyLabel: 'No category found.',
		widthClass: 'sm:w-[200px]'
	}
];

export const publicationUiFilterDefinitions = publicationFilterDefinitions.filter(definition => definition.ui);
export const publicationHiddenFilterDefinitions = publicationFilterDefinitions.filter(
	definition => !definition.ui
);

export function getPublicationFilterQueryValue(
	searchParams: URLSearchParams,
	definition: PublicationFilterDefinition
): string {
	for (const key of [definition.key, ...(definition.aliases ?? [])]) {
		const value = searchParams.get(key);
		if (value) {
			return value;
		}
	}

	return '';
}

export function getPublicationFilterValues(
	publication: Publication,
	definition: PublicationFilterDefinition
): string[] {
	if (definition.mode === 'year') {
		return [new Date(publication.releaseDate).getFullYear().toString()];
	}

	const field = definition.field ?? definition.key;
	const rawValue = publication[field];

	if (Array.isArray(rawValue)) {
		return rawValue.filter((value): value is string => typeof value === 'string');
	}

	return typeof rawValue === 'string' ? [rawValue] : [];
}

export function matchesPublicationFilter(
	publication: Publication,
	definition: PublicationFilterDefinition,
	value: string
): boolean {
	if (!value) {
		return true;
	}

	return getPublicationFilterValues(publication, definition).includes(value);
}
