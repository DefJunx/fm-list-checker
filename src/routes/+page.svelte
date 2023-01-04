<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import alive from '$lib/assets/alive.png';
	import dead from '$lib/assets/dead.png';
	import Icon from '$lib/components/icon.svelte';

	export let form: ActionData;
</script>

<main class="container">
	{#if form?.notFoundPeople?.length}
		<p>Non sono riuscito a trovare le seguenti cariatidi:</p>
		<ul>
			{#each form.notFoundPeople as person}
				<li>{person}</li>
			{/each}
		</ul>
	{/if}

	{#if form && 'error' in form}
		<p>{form.error}</p>
	{/if}

	<form use:enhance method="post" enctype="multipart/form-data" action="?/loadList">
		<label for="nameList">
			Lista nomi
			<input type="file" name="nameList" id="nameList" />
			<small
				>La lista deve essere un documento di testo (.txt) e deve esserci un solo nome per linea;
				Massimo 25 nomi</small
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

	{#if form && form.people?.length}
		<p>Ecco il riassunto del necrologio richiestomi:</p>
		<div class="row">
			{#each form.people as person}
				<article class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
					<header>{person.name}</header>
					<div>
						<p><strong>Età:</strong> {person.age}</p>
						<p>
							<strong>Data di nascita:</strong>
							{new Intl.DateTimeFormat('it-IT', { dateStyle: 'full' }).format(person.dob)}
						</p>
						{#if person.dod}
							<p>
								<strong>Data del decesso:</strong>
								{new Intl.DateTimeFormat('it-IT', { dateStyle: 'full' }).format(person.dod)}
							</p>
							<p><strong>Punti:</strong> {151 - person.age}</p>
						{/if}
					</div>
					<footer>
						<span>Come sta sto cristian*?</span>
						{#if person.dod}
							<Icon iconSrc={dead} />
						{:else}
							<Icon iconSrc={alive} />
						{/if}
					</footer>
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	main {
		margin-top: 50px;
	}
	article {
		padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);
	}
	article > div {
		min-height: 210px;
	}

	article footer {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
