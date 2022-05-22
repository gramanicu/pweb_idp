<script lang="ts">
	import Badge from '$components/simple/Badge.svelte';
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import { parseServiceType } from '$lib/helpers';
	import type { Service } from '$lib/types';
	import { User } from '@steeze-ui/heroicons';

	export let service: Service;
</script>

{#if service && service.provider}
	<div class="w-full max-w-sm p-4 border border-black rounded-md">
		<div class="flex flex-row w-full items-center">
			<h1 class="font-bold text-2xl mr-2">{service.name}</h1>
			<Badge text={parseServiceType(service.type)} class="text-2xl" />
		</div>
		<div class="py-2">
			<ImageLabel
				img={User}
				imgTheme="outline"
				text="Provider: {service.provider.name}"
				class="text-lg"
			/>
		</div>
		{#if service.description != ''}
			<div class="bg-gray-300 p-2 rounded-md mt-4 text-sm">
				{service.description}
			</div>
		{/if}
	</div>
{/if}
