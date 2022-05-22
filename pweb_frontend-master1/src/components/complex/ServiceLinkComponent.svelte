<script lang="ts">
	import Badge from '$components/simple/Badge.svelte';
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import { parseServiceType } from '$lib/helpers';
	import type { Service } from '$lib/types';
	import { ArrowRight, OfficeBuilding } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let service: Service;
</script>

{#if service && service.location}
	<div
		class="w-full max-w-sm py-2 px-4 border border-black rounded-md flex flex-row relative items-center"
	>
		<div class="flex flex-col">
			<div class="flex flex-row flex-wrap  w-full items-center">
				<h1 class="font-bold text-xl mr-2 whitespace-nowrap">{service.name}</h1>
				<Badge text={parseServiceType(service.type)} class="text-xl whitespace-nowrap" />
			</div>
			<div class="pt-1">
				<a sveltekit:prefetch href="/dashboard/locations/{service.location.id}">
					<ImageLabel
						img={OfficeBuilding}
						imgTheme="outline"
						text={service.location.name}
						imgColor="secondary"
						imgSize="20px"
						class="text-slate-500 text-md font-semibold"
					/>
				</a>
			</div>
		</div>
		<a
			href="/dashboard/services/{service.id}"
			class="ml-auto w-6 h-6 rounded-full transition-colors duration-200 hover:text-tertiary"
		>
			<Icon src={ArrowRight} />
		</a>
	</div>
{/if}
