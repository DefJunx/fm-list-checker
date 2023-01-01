<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form use:enhance method="post" enctype="multipart/form-data" action="?/loadList">
	<input type="file" name="nameList" id="nameList" />
	<button type="submit">Go</button>

	{#if form && 'people' in form}
		<ul>
			{#each form.people as person}
				<li>
					<p>{person.name}</p>
					<p>{person.age}</p>
					<p>{new Intl.DateTimeFormat('it-IT').format(person.dob)}</p>
					{#if person.dod}
						<p>{new Intl.DateTimeFormat('it-IT').format(person.dod)}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</form>

<form method="post" action="?/searchName" use:enhance>
	Cerca una persona: <input type="text" name="name" />
	<button type="submit">Cerca</button>
	{#if form && 'person' in form}
		{@const person = form.person}
		<p>{person.name}</p>
		<p>{person.age}</p>
		<p>{new Intl.DateTimeFormat('it-IT').format(person.dob)}</p>
		{#if person.dod}
			<p>{new Intl.DateTimeFormat('it-IT').format(person.dod)}</p>
		{/if}
	{/if}
</form>
