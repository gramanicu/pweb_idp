<script lang="ts">
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import type { Location } from '$lib/types';
	import { ArrowRight, LocationMarker } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let location: Location;
</script>

{#if location}
	<div
		class="w-full max-w-sm py-2 px-4 border border-black rounded-md flex flex-row relative items-center"
	>
		<div class="flex flex-col">
			<h1 class="font-bold text-xl leading-none">{location.name}</h1>
			<div class="pt-1">
				<ImageLabel
					img={LocationMarker}
					text={location.address}
					imgColor="slate-500"
					imgSize="14px"
					class="text-slate-500 text-sm font-semibold"
				/>
			</div>
		</div>
		<a
			sveltekit:prefetch
			href="/dashboard/locations/{location.id}"
			class="ml-auto w-6 h-6 rounded-full transition-colors duration-200 hover:text-tertiary"
		>
			<Icon src={ArrowRight} />
		</a>
	</div>
{/if}
