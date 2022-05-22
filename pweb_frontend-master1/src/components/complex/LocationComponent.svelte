<script lang="ts">
	import Badge from '$components/simple/Badge.svelte';
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import { parseServiceType } from '$lib/helpers';
	import type { Location } from '$lib/types';
	import { LocationMarker, User } from '@steeze-ui/heroicons';

	export let location: Location;
</script>

{#if location && location.owner}
	<div class="w-full max-w-sm p-4 border border-black rounded-md">
		<h1 class="font-bold text-2xl">{location.name}</h1>
		<div class="mb-2">
			<ImageLabel
				img={LocationMarker}
				text={location.address}
				imgColor="slate-500"
				imgSize="16px"
				class="text-slate-500 text-base font-semibold"
			/>
		</div>
		<div class="py-2 {location.services && location.services.length > 0 ? 'mb-2' : ''}">
			<ImageLabel img={User} imgTheme="outline" text={location.owner.name} class="text-lg" />
		</div>
		<div class="w-full flex flex-row">
			{#if location.services}
				{#each location.services as service}
					<Badge class="mr-2" text={parseServiceType(service.type)} />
				{/each}
			{/if}
		</div>
	</div>
{/if}
