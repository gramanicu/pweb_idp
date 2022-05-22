<script lang="ts">
	import { goto } from '$app/navigation';
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import LargeButton from '$components/simple/LargeButton.svelte';
	import LargeOutlineButton from '$components/simple/LargeOutlineButton.svelte';
	import { callApiAuth } from '$lib/api';
	import { userType } from '$lib/store';
	import { UserTypes, type Location } from '$lib/types';
	import { LocationMarker } from '@steeze-ui/heroicons';

	let location: Location = {
		name: '',
		address: '',
		id_owner: 0,
		id: 0
	};

	async function submit() {
		const res = await callApiAuth(
			'/locations/new',
			'POST',
			JSON.stringify({
				name: location.name,
				address: location.address
			})
		);

		if (res) {
			goto('/dashboard/locations');
		}
	}

	$: validLocation = location.name != '' && location.address != '';
</script>

<main class="min-w-full flex flex-col p-4 items-center">
	{#if $userType == UserTypes.Owner}
		<div class="w-full flex flex-col max-w-sm">
			<h1 class="text-primary text-2xl font-bold">Add location</h1>
			<div class="mt-2 flex flex-col p-4 border border-black rounded-md shadow-md">
				<div class="flex flex-row items-center text-lg mb-4">
					<span class="font-bold text-2xl mr-2">Name: </span>
					<input
						bind:value={location.name}
						class="px-3 py-2 text-lg leading-none rounded-md"
						type="text"
						name="name"
						id="name"
					/>
				</div>
				<div class="flex flex-row items-center text-lg mb-4">
					<ImageLabel
						class="text-base font-semibold text-gray-500"
						imgColor="gray-500"
						img={LocationMarker}
						text="Full address"
					/>
					<input
						bind:value={location.address}
						class="ml-2 px-1.5 py-1 text-lg leading-none rounded-md"
						type="text"
						name="address"
						id="address"
					/>
				</div>
			</div>
			<div class="w-full mt-4 grid grid-cols-2 gap-4">
				<LargeOutlineButton
					on:click={() => {
						goto('/dashboard');
					}}
					class="text-lg"
					text="Cancel"
				/>

				{#if validLocation}
					<LargeButton
						on:click={() => {
							submit();
						}}
						class="text-lg"
						text="Submit"
					/>
				{/if}
			</div>
		</div>
	{:else}
		No access
	{/if}
</main>
