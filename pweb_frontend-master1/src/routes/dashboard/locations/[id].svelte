<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import LocationComponent from '$components/complex/LocationComponent.svelte';
	import Breadcrumbs from '$components/simple/Breadcrumbs.svelte';
	import Dropdown from '$components/simple/Dropdown.svelte';
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import LargeButton from '$components/simple/LargeButton.svelte';
	import LargeOutlineButton from '$components/simple/LargeOutlineButton.svelte';

	import { callApiAuth } from '$lib/api';
	import { parseServiceType } from '$lib/helpers';
	import { userType } from '$lib/store';
	import { type Location, type Service, UserTypes, type Refugee, serviceTypes } from '$lib/types';
	import { LocationMarker } from '@steeze-ui/heroicons';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let location: Location;
	let refugee: Refugee;

	interface Option {
		text: string;
		value: any;
	}

	let newService: Service = {
		id: 0,
		type: serviceTypes.GENERIC,
		name: '',
		description: '',
		id_provider: 0,
		id_loc: 0
	};

	let selectedServiceType: Option = {
		text: 'Service Type',
		value: ''
	};

	let serviceTypeOptions: Option[] = [];

	onMount(async () => {
		const id = $page.params.id;
		const rawLocation = await callApiAuth(`/locations/${id}`, 'Get');
		if (rawLocation) {
			location = JSON.parse(rawLocation);
		}

		if (get(userType) == UserTypes.Refugee) {
			const rawRefugee = await callApiAuth('/users/get', 'Get');

			if (rawRefugee) {
				refugee = JSON.parse(rawRefugee);
			}
		}

		if (get(userType) == UserTypes.Provider) {
			const rawProvider = await callApiAuth('/users/get', 'Get');

			if (rawProvider) {
				newService.provider = JSON.parse(rawProvider);
				newService = newService;
			}
		}

		Object.entries(serviceTypes).forEach(([key, value], index) => {
			if (
				!location.services ||
				!location.services.find((service) => {
					return service.type == key;
				})
			) {
				serviceTypeOptions.push({
					text: parseServiceType(value.toLowerCase()),
					value: key
				});
			}
		});

		serviceTypeOptions = serviceTypeOptions;
	});

	async function sendAccommodationRequest() {
		const res = await callApiAuth(
			`/accommodation-request/new`,
			'POST',
			JSON.stringify({
				location_id: location.id
			})
		);

		if (res) {
			goto('/dashboard/locations');
		}
	}

	$: validService =
		newService.name != '' && newService.description != '' && selectedServiceType.value;

	async function createNewService() {
		newService.type = selectedServiceType.value;

		const res = await callApiAuth(
			'/services/new',
			'POST',
			JSON.stringify({
				id_loc: location.id,
				type: newService.type,
				name: newService.name,
				description: newService.description
			})
		);

		if (res) {
			goto('/dashboard/services');
		}
	}
</script>

<main class="min-w-full flex flex-col p-4 items-center">
	<div class="w-full flex flex-col max-w-sm">
		{#if location}
			<Breadcrumbs
				links={[
					{ url: '/dashboard/locations', text: 'Locations' },
					{ url: '', text: location.name }
				]}
			/>
			<span class="mb-4" />
			<LocationComponent {location} />

			{#if $userType == UserTypes.Refugee && refugee && !refugee.id_loc}
				<span class="mb-2" />
				<LargeButton on:click={() => sendAccommodationRequest()} text="Request accommodation" />
			{:else if $userType == UserTypes.Provider && newService.provider}
				<h2 class="font-bold text-lg mt-4">Create a new service</h2>
				<div class="flex flex-col p-4 border border-black rounded-md shadow-md">
					<div class="flex flex-row items-center text-lg mb-4 w-full">
						<span class="font-bold text-2xl mr-2">Name: </span>
						<input
							bind:value={newService.name}
							class="px-3 py-2 text-lg leading-none rounded-md w-full"
							type="text"
							name="name"
							id="name"
						/>
					</div>
					<div class="flex flex-row items-center text-lg mb-4 w-full">
						<span class="font-bold mr-2 whitespace-nowrap">Service Type</span>
						<Dropdown bind:selectedOption={selectedServiceType} options={serviceTypeOptions} />
					</div>
					<div class="flex flex-col items-start w-full">
						<textarea
							bind:value={newService.description}
							class="resize-none w-full bg-gray-300 rounded-md border-none"
							name="notes"
							id="notes"
							rows="4"
							placeholder="Service description (not optional)"
						/>
					</div>
				</div>
				<div class="w-full mt-4 grid grid-cols-2 gap-4">
					{#if validService}
						<LargeButton
							on:click={() => {
								createNewService();
							}}
							class="text-lg col-start-2"
							text="Submit"
						/>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</main>
