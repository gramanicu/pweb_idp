<script lang="ts">
	import LocationLinkComponent from '$components/complex/LocationLinkComponent.svelte';
	import { callApiAuth } from '$lib/api';
	import { userType } from '$lib/store';
	import { UserTypes, type Location, type Owner } from '$lib/types';
	import { onMount } from 'svelte';

	let locations: Location[];

	onMount(async () => {
		const rawLocations = await callApiAuth('/locations', 'Get');
		if (rawLocations) {
			locations = JSON.parse(rawLocations);
		}
	});
</script>

<main class="min-w-full flex flex-col p-4 items-center">
	{#if locations && locations.length != 0}
		<div class="w-full flex flex-col max-w-sm mb-4">
			{#if $userType == UserTypes.Refugee || $userType == UserTypes.Provider}
				<h1 class="text-primary text-2xl font-bold">Found locations: {locations.length}</h1>
			{:else if $userType == UserTypes.Owner}
				<h1 class="text-primary text-2xl font-bold">Owned locations: {locations.length}</h1>{/if}
		</div>

		{#each locations as location}
			<LocationLinkComponent {location} />
			<span class="mb-2" />
		{/each}
	{:else}
		<div class="w-full flex flex-col max-w-sm mb-4">
			{#if $userType == UserTypes.Refugee || $userType == UserTypes.Provider}
				<h1 class="text-primary text-center text-2xl font-bold">No locations found</h1>
			{:else if $userType == UserTypes.Owner}
				<h1 class="text-primary text-center text-2xl font-bold">No owned locations</h1>{/if}
		</div>
	{/if}
</main>
