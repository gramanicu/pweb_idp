<script lang="ts">
	import LocationLinkComponent from '$components/complex/LocationLinkComponent.svelte';
	import RefugeeComponent from '$components/complex/RefugeeComponent.svelte';
	import LargeButton from '$components/simple/LargeButton.svelte';
	import { callApi, callApiAuth } from '$lib/api';

	import type { Location, Refugee } from '$lib/types';

	import { onMount } from 'svelte';

	let refugee: Refugee;

	async function loadExtra(ref: Refugee) {
		const rawCountry = await callApi(`/generic/countries/${ref.id_country}`, 'GET');
		const rawLanguage = await callApi(`/generic/languages/${ref.id_language}`, 'GET');

		if (rawLanguage) {
			ref.language = JSON.parse(rawLanguage);
		}

		if (rawCountry) {
			ref.country = JSON.parse(rawCountry);
		}

		if (ref.id_loc) {
			const rawLocation = await callApiAuth(`/locations/${ref.id_loc}`, 'GET');
			if (rawLocation) {
				ref.location = JSON.parse(rawLocation);
			}
		}

		refugee = ref;
	}

	onMount(async () => {
		const rawRefugee = await callApiAuth('/users/get', 'Get');

		if (rawRefugee) {
			const ref = JSON.parse(rawRefugee);
			loadExtra(ref);

			refugee = ref;
		}
	});

	async function leaveLocation() {
		const res = await callApiAuth('/locations/leave', 'DELETE');

		if (res) {
			const ref = JSON.parse(res);
			loadExtra(ref);

			refugee = ref;
		}
	}
</script>

{#if refugee}
	<h1 class="text-primary text-2xl font-bold">Welcome {refugee.name}!</h1>
	<RefugeeComponent {refugee} />
	{#if refugee.id_loc && refugee.location}
		<small class="mt-4 font-bold text-gray-600">You are currently staying at</small>
		<LocationLinkComponent location={refugee.location} />
		<span class="mb-2" />
		<LargeButton
			on:click={() => {
				leaveLocation();
			}}
			text="Leave Location"
		/>
	{/if}
{/if}
