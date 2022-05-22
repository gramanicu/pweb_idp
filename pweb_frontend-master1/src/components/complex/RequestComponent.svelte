<script lang="ts">
	import { goto } from '$app/navigation';
	import Badge from '$components/simple/Badge.svelte';

	import ImageLabel from '$components/simple/ImageLabel.svelte';
	import { callApiAuth } from '$lib/api';
	import { requestStatusTypes, type AccommodationRequest } from '$lib/types';
	import {
		X,
		OfficeBuilding,
		CheckCircle,
		XCircle,
		Mail,
		Phone,
		Globe,
		Translate
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { createEventDispatcher } from 'svelte';

	export let accRequest: AccommodationRequest;

	const dispatch = createEventDispatcher();

	const acceptRequest = async () => {
		const res = await callApiAuth(
			`/accommodation-request/${accRequest.id}/respond`,
			'PUT',
			JSON.stringify({
				status: requestStatusTypes.ACCEPTED
			})
		);

		if (res) {
			accRequest = JSON.parse(res);
			dispatch('responded', {
				response: requestStatusTypes.ACCEPTED
			});
		}
	};
	const declineRequest = async () => {
		const res = await callApiAuth(
			`/accommodation-request/${accRequest.id}/respond`,
			'PUT',
			JSON.stringify({
				status: requestStatusTypes.DECLINED
			})
		);

		if (res) {
			accRequest = JSON.parse(res);
			dispatch('responded', {
				response: requestStatusTypes.DECLINED
			});
		}
	};

	let opened = false;
</script>

{#if accRequest && accRequest.refugee && accRequest.location && accRequest.status == requestStatusTypes.UNANSWERED}
	<div
		class="w-full max-w-sm py-2 px-4 border {opened
			? 'rounded-t-md'
			: 'rounded-md'} border-black flex flex-row relative items-center"
	>
		<div class="flex flex-col items-start">
			<button
				class="hover:underline"
				on:click={() => {
					opened = !opened;
				}}
			>
				<h1 class="font-bold text-xl leading-none">{accRequest.refugee.name}</h1>
			</button>
			<a href="/dashboard/locations/{accRequest.location.id}">
				<div class="pt-1">
					<ImageLabel
						img={OfficeBuilding}
						imgTheme="outline"
						text={accRequest.location.name}
						imgColor="secondary"
						imgSize="16px"
						class="text-slate-500 text-base font-semibold"
					/>
				</div>
			</a>
		</div>
		<div class="flex flex-row ml-auto ">
			<button
				on:click={() => {
					acceptRequest();
				}}
				class="rounded-full transition-colors duration-200 text-secondary hover:text-primary"
			>
				<Icon size="38px" theme="solid" src={CheckCircle} />
			</button>
			<button
				on:click={() => {
					declineRequest();
				}}
				class="rounded-full transition-colors duration-200 text-secondary hover:text-primary"
			>
				<Icon size="38px" theme="solid" src={XCircle} />
			</button>
		</div>
	</div>
	{#if opened}
		<div
			class="w-full max-w-sm py-2 px-4 border border-t-0 rounded-b-md border-black flex flex-col"
		>
			<div class="flex flex-row w-full items-center">
				<h1 class="font-bold text-2xl mr-2">{accRequest.refugee.name}</h1>

				{#if accRequest.refugee.no_adults + accRequest.refugee.no_children > 1}
					<Badge text="Group" />
				{:else}
					<Badge text="Individual" />
				{/if}
			</div>
			{#if accRequest.refugee.no_adults + accRequest.refugee.no_children > 1}
				<h2 class="font-bold text-base text-slate-400 leading-none">
					Adults: {accRequest.refugee.no_adults}{#if accRequest.refugee.no_children > 0}, Kids: {accRequest
							.refugee.no_children}{/if}
				</h2>
			{/if}
			<div class="py-2">
				<ImageLabel
					img={Mail}
					imgSize="16px"
					imgTheme="outline"
					imgColor="slate-500"
					text={accRequest.refugee.email}
					class="text-base text-slate-500 font-semibold"
				/>
			</div>
			<div class="py-2">
				<a href="tel:{accRequest.refugee.phone}">
					<ImageLabel
						img={Phone}
						imgColor="slate-500"
						imgSize="16px"
						text={accRequest.refugee.phone}
						class="text-base text-slate-500 font-semibold"
					/>
				</a>
			</div>
			<div class="bg-gray-300 p-2 rounded-md mt-2 text-sm">
				{#if accRequest.refugee.notes == ''} No notes {:else} {accRequest.refugee.notes} {/if}
			</div>

			<div class="grid grid-cols-2 justify-start w-full mt-3">
				{#if accRequest.refugee.country}
					<ImageLabel
						img={Globe}
						imgSize="18px"
						text={accRequest.refugee.country.name}
						class="text-lg"
					/>
				{/if}
				{#if accRequest.refugee.language}
					<ImageLabel
						img={Translate}
						imgSize="18px"
						text={accRequest.refugee.language.name}
						class="text-lg"
					/>
				{/if}
			</div>
		</div>
	{/if}
{/if}
