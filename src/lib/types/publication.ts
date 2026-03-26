export interface PublicationPartner {
	name: string;
	url: string;
}

export interface Publication {
	name: string;
	publisher?: string;
	releaseDate: string;
	url: string;
	summary?: string;
	partners?: PublicationPartner[];
	tags?: string[];
	category?: string | string[];
	featured?: boolean;
	[key: string]: unknown;
}
