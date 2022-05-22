<script lang="ts">
	import LocationLinkComponent from '$components/complex/LocationLinkComponent.svelte';
	import ProviderComponent from '$components/complex/ProviderComponent.svelte';
	import RefugeeComponent from '$components/complex/RefugeeComponent.svelte';
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import { callApiAuth } from '$lib/api';
	import type { Provider } from '$lib/types';
	import { Clipboard, ClipboardList } from '@steeze-ui/heroicons';
	import { onMount } from 'svelte';

	let provider: Provider;

	onMount(async () => {
		const rawProvider = await callApiAuth('/users/get', 'Get');

		if (rawProvider) {
			provider = JSON.parse(rawProvider);

			const rawServices = await callApiAuth('/services', 'GET');
			if (rawServices) {
				provider.services = JSON.parse(rawServices);
			}
		}
	});
</script>

{#if provider}
	<h1 class="text-primary text-2xl font-bold">Welcome {provider.name}!</h1>
	<a href="/dashboard/services">
		<ImageLabel
			img={ClipboardList}
			imgTheme="outline"
			imgColor="secondary"
			class="text-secondary text-lg hover:underline"
			text="Providing {provider.services ? provider.services.length : '0'} services"
		/>
	</a>
	<span class="mb-4" />
	<ProviderComponent {provider} />
{/if}
