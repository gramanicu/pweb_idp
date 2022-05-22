<script lang="ts">
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import type { Provider } from '$lib/types';
	import { Mail, Phone } from '@steeze-ui/heroicons';

	export let provider: Provider;
</script>

{#if provider}
	<div class="w-full max-w-sm p-4 border border-black rounded-md">
		<h1 class="font-bold text-2xl">{provider.name}</h1>
		<div class="py-2">
			<ImageLabel
				img={Mail}
				imgSize="16px"
				imgTheme="outline"
				imgColor="slate-500"
				text={provider.email}
				class="text-base text-slate-500 font-semibold"
			/>
		</div>
		<a href="tel:{provider.phone}" class="py-2">
			<ImageLabel
				img={Phone}
				imgColor="slate-500"
				imgSize="16px"
				text={provider.phone}
				class="text-base text-slate-500 font-semibold"
			/>
		</a>
	</div>
{/if}
