<script lang="ts">
	import { ChevronDown } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { clickOutside } from 'svelte-use-click-outside';

	interface Option {
		text: string;
		value: any;
	}

	let opened = false;

	function clickOutsideHandler() {
		opened = false;
	}

	export let options: Option[];
	export let selectedOption = { text: '', value: '' };
</script>

<div
	use:clickOutside={clickOutsideHandler}
	class="{$$props.class} relative inline-block text-left w-full"
>
	<div class="w-full">
		<button
			on:click={() => {
				opened = !opened;
			}}
			class="w-full leading-none dropdown-button p-2 border inline-flex flex-row justify-between items-center border-black rounded-md relative hover:shadow-lg"
			type="button"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
			><span class="mr-6"> {selectedOption.text}</span>
			<Icon size="24px" src={ChevronDown} theme="solid" class="absolute right-1" />
		</button>
	</div>
	<div
		class="{opened
			? 'block'
			: 'hidden'} z-10 origin-top-right absolute right-0 mt-1 rounded-md shadow-lg border border-gray-500 bg-white min-w-full w-fit"
		role="menu"
		aria-orientation="vertical"
		aria-labelledby="menu-button"
		tabindex="-1"
	>
		<div
			class="flex flex-col max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
			role="none"
		>
			{#each options as option, index}
				<button
					on:click={() => {
						selectedOption = option;
						opened = false;
					}}
					class="block w-full px-4 py-2 text-left  {index != options.length - 1
						? 'border-b border-gray-500'
						: ''} {selectedOption == option
						? 'text-secondary pointer-events-none'
						: ' hover:underline'}"
					role="menuitem"
					tabindex="-1"
					id="menu-item-{index}"
					type="button"
				>
					<span class="mr-2">{option.text}</span></button
				>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.dropdown-button {
		min-width: 160px;
	}
</style>
