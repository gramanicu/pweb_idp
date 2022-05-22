<script lang="ts">
	import { page } from '$app/stores';
	import LocationComponent from '$components/complex/LocationComponent.svelte';
	import ServiceComponent from '$components/complex/ServiceComponent.svelte';
	import Breadcrumbs from '$components/simple/Breadcrumbs.svelte';

	import { callApiAuth } from '$lib/api';
	import { userType } from '$lib/store';
	import { UserTypes, type Service } from '$lib/types';
	import { LocationMarker } from '@steeze-ui/heroicons';
	import { onMount } from 'svelte';

	let service: Service;

	onMount(async () => {
		const id = $page.params.id;
		const rawService = await callApiAuth(`/services/${id}`, 'GET');
		if (rawService) {
			service = JSON.parse(rawService);
		}
	});
</script>

<main class="min-w-full flex flex-col p-4 items-center">
	{#if $userType == UserTypes.Provider}
		<div class="w-full flex flex-col max-w-sm">
			{#if service}
				<Breadcrumbs
					links={[
						{ url: '/dashboard/services', text: 'Services' },
						{ url: '', text: service.name }
					]}
				/>
				<span class="mb-4" />
				<ServiceComponent {service} />
			{/if}
		</div>
	{:else}
		No access
	{/if}
</main>
