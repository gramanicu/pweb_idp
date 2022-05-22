<script lang="ts">
	import { ArrowNarrowRight, ArrowRight, ChevronRight } from '@steeze-ui/heroicons';

	import { Icon } from '@steeze-ui/svelte-icon';

	interface BreadcrumbLink {
		url: string;
		text: string;
	}

	export let links: BreadcrumbLink[];
</script>

<div class="flex flex-row justify-start items-center">
	{#each links as link, index}
		{#if index != 0}
			<Icon size="18px" src={ChevronRight} theme="solid" class="text-tertiary" />
		{/if}
		{#if link.url !== ''}
			<a sveltekit:prefetch href={link.url} class="hover:underline text-tertiary">{link.text}</a>
		{:else}
			<span class=" cursor-default select-none ">{link.text}</span>
		{/if}
	{/each}
</div>
