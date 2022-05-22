<script lang="ts">
	import '$scss/app.scss';
	import { onMount } from 'svelte';
	import auth from '$lib/authService';
	import { auth0Client, isAuthenticated, userType } from '$lib/store';
	import { goto } from '$app/navigation';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Menu, X, Bell, Logout } from '@steeze-ui/heroicons';
	import Logo from '$components/logo.svelte';
	import { page } from '$app/stores';
	import type { Auth0Client } from '@auth0/auth0-spa-js';
	import { UserTypes } from '$lib/types';
	import { get } from 'svelte/store';

	let menuOpened: boolean = false;

	onMount(async () => {
		let client: Auth0Client | null;
		if (!$isAuthenticated) {
			client = $auth0Client;
			if (!client) {
				client = await auth.createClient();
			}

			await auth.loginWithPopup(client, {});

			if (!$isAuthenticated) {
				// window.location.href = '/';
			}
		}
	});

	function logout() {
		const client = $auth0Client;
		if (client) {
			auth.logout(client, { returnTo: window.location.origin });
		}
	}

	const providerLinks = [
		{
			text: 'Dashboard',
			url: '/dashboard'
		},
		{
			text: 'Services',
			url: '/dashboard/services'
		},
		{
			text: 'Locations',
			url: '/dashboard/locations'
		}
	];

	const ownerLinks = [
		{
			text: 'Dashboard',
			url: '/dashboard'
		},
		{
			text: 'Requests',
			url: '/dashboard/requests'
		},
		{
			text: 'Locations',
			url: '/dashboard/locations'
		},
		{
			text: 'Create Location',
			url: '/dashboard/locations/new'
		}
	];

	const refugeeLinks = [
		{
			text: 'Dashboard',
			url: '/dashboard'
		},
		{
			text: 'Locations',
			url: '/dashboard/locations'
		}
	];

	const links =
		get(userType) == UserTypes.Owner
			? ownerLinks
			: get(userType) == UserTypes.Provider
			? providerLinks
			: get(userType) == UserTypes.Refugee
			? refugeeLinks
			: [];
</script>

<svelte:head>
	<link rel="icon" href="./favicon.png" />
</svelte:head>

{#if $isAuthenticated}
	<div class="relative flex flex-col">
		<header class="w-full flex flex-row justify-between items-center bg-primary p-4 text-white">
			<button
				on:click={() => {
					menuOpened = !menuOpened;
				}}
				type="button"
			>
				<span class="sr-only">Open main menu</span>
				<Icon
					src={menuOpened ? X : Menu}
					theme="solid"
					class="w-6 h-6 transition-colors duration-200 text-gray-300 hover:text-white"
				/></button
			>
			<Logo class="text-2xl font-medium tracking-widest leading-none" />
			<button
				on:click={() => {
					logout();
				}}
				type="button"
			>
				<Icon
					src={Logout}
					theme="outline"
					class="w-6 h-6 transition-colors duration-200 text-gray-300 hover:text-white"
				/>
			</button>
		</header>
		<nav
			class="w-full z-10  {menuOpened
				? 'flex'
				: 'hidden'} max-w-md sm:rounded-b-md flex-col absolute top-14 bg-white border-b border-black"
		>
			{#each links as link, index}
				<a
					on:click={() => {
						menuOpened = false;
					}}
					href={link.url}
					class="w-full text-2xl border font-medium leading-none p-4 flex flex-row justify-center items-center {link.url ===
					$page.url.pathname
						? 'bg-secondary border-secondary  select-none cursor-pointer pointer-events-none  text-white'
						: 'bg-white text-black border-black hover:underline'} {index == links.length - 1
						? 'sm:rounded-b-md'
						: ''}"
				>
					{link.text}
				</a>
			{/each}
		</nav>
	</div>
	<slot />
{/if}
