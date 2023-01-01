import { MAX_LIST_LENGTH } from '$lib/constants';
import { getInfoFromWikipedia, throwError, type Person } from '$lib/utils';
import type { Actions } from './$types';

export const actions: Actions = {
	async loadList({ request, fetch }) {
		const formData = await request.formData();
		const file = (await formData.get('nameList')) as File;
		const text = await file.text();
		const names = text.split('\r\n');
		const people: Person[] = [];
		const notFoundPeople: string[] = [];

		if (names.length > MAX_LIST_LENGTH) {
			return throwError(500, 'La lista può essere di massimo 25 nomi, riprova!');
		}

		for (const name of names) {
			try {
				people.push(await getInfoFromWikipedia(name, fetch));
			} catch (e) {
				notFoundPeople.push(name);
			}
		}

		return {
			people,
			notFoundPeople
		};
	},

	async searchName({ request, fetch }) {
		const data = await request.formData();
		const name = (await data.get('name')) as string;
		const notFoundPeople = [];
		const people = [];

		try {
			people.push(await getInfoFromWikipedia(name, fetch));
		} catch (e) {
			notFoundPeople.push(name);
		}

		return {
			people,
			notFoundPeople
		};
	}
};
