<script lang="ts">
	export let text: string;
</script>

<button
	on:click
	class="{$$props.class} px-4 py-2 w-full max-w-sm text-white border border-primary bg-primary rounded-md leading-none {$$props.class}"
	>{text}</button
>
