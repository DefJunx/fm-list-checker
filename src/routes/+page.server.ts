import { getInfoFromWikipedia, type Person } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async loadList({ request, fetch }) {
		const formData = await request.formData();
		const file = (await formData.get('nameList')) as File;
		const text = await file.text();
		const names = text.split('\r\n');
		const people: Person[] = [];
		const notFoundPeople: string[] = [];

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
		let person: Person;

		try {
			person = await getInfoFromWikipedia(name, fetch);
		} catch (e) {
			throw fail(404, { notFound: true });
		}

		return {
			person
		};
	}
};
