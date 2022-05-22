<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Clock } from '@steeze-ui/heroicons';

	export let img = Clock;
	export let imgColor = 'black';
	export let imgTheme = 'solid';
	export let imgSize = '18px';
	export let text: string;
</script>

<div class="flex flex-row justify-start items-center">
	<Icon size={imgSize} src={img} theme={imgTheme} class="mr-1 text-{imgColor}" />
	<span class="leading-none {$$props.class}">{text}</span>
</div>
