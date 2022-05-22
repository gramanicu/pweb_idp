<script lang="ts">
	import ServiceComponent from '$components/complex/ServiceComponent.svelte';
	import ServiceLinkComponent from '$components/complex/ServiceLinkComponent.svelte';

	import { callApiAuth } from '$lib/api';
	import { userType } from '$lib/store';
	import { UserTypes, type Service } from '$lib/types';
	import { onMount } from 'svelte';

	let services: Service[];

	onMount(async () => {
		const rawServices = await callApiAuth('/services', 'Get');
		if (rawServices) {
			services = JSON.parse(rawServices);
		}
	});
</script>

<main class="min-w-full flex flex-col p-4 items-center">
	{#if $userType == UserTypes.Provider}
		{#if services}
			<div class="w-full flex flex-col max-w-sm mb-4">
				<h1 class="text-primary text-2xl font-bold">Providing {services.length} services</h1>
			</div>

			{#each services as service}
				<ServiceLinkComponent {service} />
				<span class="mb-2" />
			{/each}
		{:else}
			<div class="w-full flex flex-col max-w-sm mb-4">
				<h1 class="text-primary text-center text-2xl font-bold">Providing no services</h1>
			</div>
		{/if}
	{:else}
		No access
	{/if}
</main>
