<script lang="ts">
	export let text: string;
</script>

<button
	on:click
	class="{$$props.class} px-4 py-2 w-full max-w-sm text-primary leading-none bg-transparent border border-primary rounded-md "
	>{text}</button
>
