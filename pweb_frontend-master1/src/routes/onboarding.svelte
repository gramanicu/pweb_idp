<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Logo from '$components/logo.svelte';
	import Button from '$components/simple/Button.svelte';
	import CheckLabel from '$components/simple/CheckLabel.svelte';
	import Dropdown from '$components/simple/Dropdown.svelte';
	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import LargeButton from '$components/simple/LargeButton.svelte';
	import LargeOutlineButton from '$components/simple/LargeOutlineButton.svelte';
	import OutlineButton from '$components/simple/OutlineButton.svelte';
	import { callApi, callApiAuth } from '$lib/api';
	import type { Country, Language } from '$lib/types';
	import { vars } from '$lib/variables';
	import { Hashtag } from '@steeze-ui/heroicons';
	import { onMount } from 'svelte';

	const emailAuth0 = $page.url.searchParams.get('email');
	const idAuth0 = $page.url.searchParams.get('auth0_id');
	let countriesOptions: Option[] = [];
	let languagesOptions: Option[] = [];
	let step = 0;

	interface Option {
		text: string;
		value: any;
	}

	onMount(async () => {
		const rawCountries = await callApi('/generic/countries', 'GET');
		const rawLanguages = await callApi('/generic/languages', 'GET');

		if (rawCountries && rawLanguages) {
			const countries: Country[] = JSON.parse(rawCountries);
			const languages: Language[] = JSON.parse(rawLanguages);

			for (const country of countries) {
				countriesOptions.push({
					text: country.name,
					value: country.id
				});
			}

			for (const language of languages) {
				languagesOptions.push({
					text: language.name,
					value: language.id
				});
			}
		}

		countriesOptions = countriesOptions;
		languagesOptions = languagesOptions;
	});

	let selectedRole = {
		text: 'Choose role',
		value: ''
	};
	let selectedCountry: Option = {
		text: 'Select country',
		value: ''
	};
	let selectedLanguage: Option = {
		text: 'Select language',
		value: ''
	};

	let email = emailAuth0;
	let phone = '';
	let name = '';
	let isGroup = false;
	let no_adults = 1;
	let no_children = 0;
	let notes = '';

	$: validContact = email != '' && phone != '' && name != '';
	$: validRefugee = validContact && no_adults >= 1 && no_children >= 0;

	async function submit() {
		if (selectedRole.value != '') {
			console.log(
				`${selectedRole.value} ${isGroup} ${no_adults} ${no_children} ${notes} ${phone} ${email} ${name}`
			);

			const res = await callApi(
				'/users/new',
				'POST',
				JSON.stringify({
					email,
					phone,
					role: selectedRole.value,
					name,
					id_country: selectedCountry.value,
					id_language: selectedLanguage.value,
					notes,
					no_adults,
					no_children,
					auth0_id: idAuth0
				})
			);

			if (res) {
				console.log(res);
				const state = $page.url.searchParams.get('state');
				goto(`https://${vars.auth0.domain}/continue?state=${state}&role=${selectedRole.value}`);
			}
		}
	}
</script>

<header class="w-full flex flex-row justify-center items-center bg-primary p-4 text-white">
	<Logo class="text-2xl font-medium tracking-widest leading-none" />
</header>
<main class="w-screen flex flex-col p-4 max-w-sm mx-auto">
	<h1 class="text-primary text-2xl font-bold">First, choose your role</h1>
	<Dropdown
		class="w-full text-2xl"
		bind:selectedOption={selectedRole}
		options={[
			{ value: 'owner', text: 'Owner' },
			{ value: 'provider', text: 'Provider' },
			{ value: 'refugee', text: 'Refugee' }
		]}
	/>

	{#if selectedRole.value == 'owner' || selectedRole.value == 'provider'}
		<form class="mt-4 mb-4">
			<h2 class="font-bold text-lg">Contact information</h2>
			<div class="flex flex-col border border-black rounded-lg p-4 shadow-md">
				<div class="flex flex-col w-full mb-2">
					<label class="font-bold text-lg" for="name">Full name</label>
					<input
						bind:value={name}
						class="px-3 py-2 text-lg leading-none rounded-md"
						type="text"
						name="name"
						id="name"
						placeholder="John Doe"
					/>
				</div>
				<div class="flex flex-col w-full mb-2">
					<label class="font-bold text-lg" for="email">Email</label>
					<input
						bind:value={email}
						class="px-3 py-2 text-lg leading-none rounded-md"
						type="email"
						name="email"
						id="email"
						placeholder={emailAuth0}
					/>
				</div>
				<div class="flex flex-col w-full">
					<label class="font-bold text-lg" for="phone">Phone</label>
					<input
						bind:value={phone}
						class="px-3 py-2 text-lg leading-none rounded-md"
						type="tel"
						name="phone"
						id="phone"
						placeholder="0123456789"
					/>
				</div>
			</div>
		</form>
		{#if validContact}
			<LargeButton
				class="text-lg"
				text="Submit"
				on:click={() => {
					submit();
				}}
			/>
		{/if}
	{:else if selectedRole.value == 'refugee'}
		{#if step == 0}
			<div class="my-4 flex flex-col border border-black rounded-lg p-4 shadow-md">
				<div class="flex flex-row items-center text-lg mb-4">
					<span class="font-bold mr-2">Country</span>
					<Dropdown bind:selectedOption={selectedCountry} options={countriesOptions} />
				</div>
				<div class="flex flex-row items-center text-lg mb-4">
					<span class="font-bold mr-2">Language</span>
					<Dropdown bind:selectedOption={selectedLanguage} options={languagesOptions} />
				</div>
				<CheckLabel bind:checked={isGroup} text="Are you a group?" />
				{#if isGroup}
					<div class="grid grid-cols-2 mt-4">
						<div class="flex flex-row">
							<ImageLabel class="text-lg" img={Hashtag} text="Adults:" />
							<input
								bind:value={no_adults}
								min="1"
								max="99"
								class="ml-2 leading-none text-lg py-1 px-1.5 w-14 rounded-md"
								type="number"
								name="no_adults"
								id="no_adults"
								placeholder="1"
							/>
						</div>
						<div class="flex flex-row">
							<ImageLabel class="text-lg" img={Hashtag} text="Children:" />
							<input
								bind:value={no_children}
								min="0"
								max="99"
								class="ml-2 leading-none text-lg py-1 px-1.5 w-14 rounded-md"
								type="number"
								name="no_children"
								id="no_children"
								placeholder="0"
							/>
						</div>
					</div>
					<div class="flex flex-col items-start w-full mt-2">
						<h3 class="text-gray-600 leading-none">Notes (special needs, etc.)</h3>

						<textarea
							bind:value={notes}
							class="resize-none w-full bg-gray-300 rounded-md border-none"
							name="notes"
							id="notes"
							rows="4"
						/>
					</div>
				{/if}
			</div>
			{#if selectedCountry.value != '' && selectedLanguage.value != ''}
				<LargeButton
					class="text-lg"
					text="Next"
					on:click={() => {
						step = 1;
					}}
				/>
			{/if}
		{:else if step == 1}
			<form class="mt-4 mb-4">
				<h2 class="font-bold text-lg leading-none">Contact information</h2>
				{#if isGroup}
					<small class="text-xs font-bold text-gray-600 leading-none"
						>*as a group, enter the information of a representant</small
					>
				{/if}
				<div class="flex flex-col border border-black rounded-lg p-4 shadow-md">
					<div class="flex flex-col w-full mb-2">
						<label class="font-bold text-lg" for="name">Full name</label>
						<input
							bind:value={name}
							class="px-3 py-2 text-lg leading-none rounded-md"
							type="text"
							name="name"
							id="name"
							placeholder="John Doe"
						/>
					</div>
					<div class="flex flex-col w-full mb-2">
						<label class="font-bold text-lg" for="email">Email</label>
						<input
							bind:value={email}
							class="px-3 py-2 text-lg leading-none rounded-md"
							type="email"
							name="email"
							id="email"
							placeholder={emailAuth0}
						/>
					</div>
					<div class="flex flex-col w-full">
						<label class="font-bold text-lg" for="phone">Phone</label>
						<input
							bind:value={phone}
							class="px-3 py-2 text-lg leading-none rounded-md"
							type="tel"
							name="phone"
							id="phone"
							placeholder="0123456789"
						/>
					</div>
				</div>
			</form>
			<div class="w-full grid grid-cols-2 gap-4">
				<LargeOutlineButton
					on:click={() => {
						step = 0;
					}}
					class="text-lg"
					text="Back"
				/>

				{#if validRefugee}
					<LargeButton
						on:click={() => {
							submit();
						}}
						class="text-lg"
						text="Submit"
					/>
				{/if}
			</div>
		{/if}
	{/if}
</main>
