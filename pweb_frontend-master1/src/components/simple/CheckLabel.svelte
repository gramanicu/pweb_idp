<script lang="ts">
	import Check from './Check.svelte';

	export let text: string;
	export let checked = false;
</script>

<div class="flex flex-row justify-start items-center">
	<span class="text-lg leading-none mr-2">{text}</span>
	<Check bind:checked />
</div>
