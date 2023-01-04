import { fail, type LoadEvent } from '@sveltejs/kit';

export const DOB_ID = 'P569';
export const DOD_ID = 'P570';

export type Person = {
	name: string;
	dob: Date;
	dod: Date | undefined;
	age: number;
};

const fixedEncodeURIComponent = (query: string) =>
	encodeURIComponent(query).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16);
	});

const sanitizeQuery = (query: string) =>
	fixedEncodeURIComponent(query.replace(/\b(\w)/g, (s) => s.toUpperCase()));

export const throwError = (code = 500, error = 'Unexpected Error') => fail(code, { error });

export const getSearchUrl = (query: string) =>
	`https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&format=json&ppprop=wikibase_item&titles=${sanitizeQuery(
		query
	)}&formatversion=2`;
export const getAlternativeSearchUrl = (query: string) =>
	`https://it.wikipedia.org/w/api.php?format=json&action=query&prop=pageprops&redirects=1&titles=${sanitizeQuery(
		query
	)}`;
export const getPropsUrl = (wikibaseItemId: string) =>
	`https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&ids=${wikibaseItemId}&format=json`;

export const getInfoFromWikipedia = async (
	name: string,
	fetch: LoadEvent['fetch']
): Promise<Person> => {
	let searchResult = await (await fetch(getSearchUrl(name))).json();

	if (searchResult?.query?.pages?.[0]?.missing) {
		searchResult = await (await fetch(getAlternativeSearchUrl(name))).json();
	}

	if (Object.values<any>(searchResult.query.pages)?.[0]?.missing === '') {
		throw new Error('Person not found');
	}

	const wikibaseItemId =
		searchResult.query.pages?.[0]?.pageprops?.wikibase_item ??
		Object.values<any>(searchResult.query.pages)?.[0]?.pageprops?.wikibase_item;

	if (!wikibaseItemId) {
		throw new Error('Person not found');
	}

	const pageProps = await (await fetch(getPropsUrl(wikibaseItemId))).json();

	const dob = new Date(
		pageProps.entities[wikibaseItemId].claims[DOB_ID][0].mainsnak.datavalue.value.time.replace(
			'+',
			''
		)
	);

	let dod = pageProps.entities[wikibaseItemId].claims[DOD_ID]?.[0].mainsnak.datavalue.value.time;
	let age = Math.ceil(Math.abs(+dob - +new Date()) / (1000 * 60 * 60 * 24 * 365));

	if (dod) {
		dod = new Date(dod.replace('+', ''));
		age = Math.ceil(Math.abs(+dod - +dob) / (1000 * 60 * 60 * 24 * 365));

		return {
			name: name.replace(/\b(\w)/g, (s) => s.toUpperCase()),
			dob,
			dod,
			age
		};
	}

	return {
		name: name.replace(/\b(\w)/g, (s) => s.toUpperCase()),
		dob,
		dod: undefined,
		age
	};
};
