<script lang="ts">
	import type { Auth0Client } from '@auth0/auth0-spa-js';
	import auth from '$lib/authService';
	import { auth0Client, isAuthenticated } from '$lib/store';
	import { goto } from '$app/navigation';
	import LargeButton from '$components/simple/LargeButton.svelte';
	let client: Auth0Client | null;

	async function login() {
		client = $auth0Client;
		if (!client) {
			client = await auth.createClient();
		}

		await auth.loginWithPopup(client, {});

		if ($isAuthenticated) {
			goto('/dashboard');
		}
	}
</script>

<main
	class=" h-screen scroll-smooth flex flex-col justify-around items-center snap-y snap-mandatory"
>
	<div
		class="flex flex-row justify-center items-center border border-black rounded-md shadow-lg p-4"
	>
		<div class="flex flex-col justify-center items-center">
			<h1 class="text-3xl font-bold">Welcome to <span class="text-primary">Charity</span></h1>
			<LargeButton on:click={() => login()} class="mt-2 text-lg" text="Sign In / Sign up" />
		</div>
	</div>
</main>
