<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<main class="container">
	{#if form && form.notFoundPeople?.length}
		<p>Non sono riuscito a trovare le seguenti cariatidi:</p>
		<ul>
			{#each form.notFoundPeople as person}
				<li>{person}</li>
			{/each}
		</ul>
	{/if}

	<form use:enhance method="post" enctype="multipart/form-data" action="?/loadList">
		<label for="nameList">
			Lista nomi
			<input type="file" name="nameList" id="nameList" />
			<small
				>La lista deve essere un documento di testo (.txt) e deve esserci un solo nome per linea</small
			>
		</label>
		<button type="submit">Cerca</button>
	</form>

	<hr />

	<form method="post" action="?/searchName" use:enhance>
		<label for="name">
			Ricerca per nome
			<input type="text" name="name" />
		</label>
		<button type="submit">Cerca</button>
	</form>

	{#if form && form.people}
		<p>Ecco il riassunto del necrologio richiestomi:</p>
		<div class="grid">
			{#each form.people as person}
				<article>
					<header>{person.name}</header>
					<div>
						<p>Età: {person.age}</p>
						<p>
							Data di nascita: {new Intl.DateTimeFormat('it-IT', { dateStyle: 'full' }).format(
								person.dob
							)}
						</p>
						{#if person.dod}
							<p>
								Data del decesso: {new Intl.DateTimeFormat('it-IT', { dateStyle: 'full' }).format(
									person.dod
								)}
							</p>
							<p>Punti: {151 - person.age}</p>
						{/if}
					</div>
					<footer>Status: {person.dod ? '🪦' : '🫡'}</footer>
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	main {
		margin-top: 50px;
	}

	article > div {
		min-height: 210px;
	}
</style>
