import createAuth0Client, {
	Auth0Client,
	type LogoutOptions,
	type PopupLoginOptions,
	type RedirectLoginOptions
} from '@auth0/auth0-spa-js';
import { user, isAuthenticated, popupOpen, auth0Client, userType } from '$lib/store';
import { vars } from '$lib/variables';
import { UserTypes } from './types';

async function createClient() {
	const client = await createAuth0Client({
		domain: vars.auth0.domain,
		client_id: vars.auth0.clientId,
		audience: vars.auth0.audience
	});

	auth0Client.set(client);
	return client;
}

async function loginWithRedirect(client: Auth0Client, options: RedirectLoginOptions) {
	try {
		await client.loginWithRedirect(options);
		const newUser = await client.getUser();

		if (newUser) {
			user.set(newUser);
			userType.set(await auth.getUserRole(client));
			isAuthenticated.set(true);
		}
	} catch (e) {
		// eslint-disable-next-line
		console.error(e);
	} finally {
		popupOpen.set(false);
	}
}

async function loginWithPopup(client: Auth0Client, options: PopupLoginOptions) {
	popupOpen.set(true);
	try {
		await client.loginWithPopup(options, { timeoutInSeconds: 360 });
		const newUser = await client.getUser();

		if (newUser) {
			user.set(newUser);
			userType.set(await auth.getUserRole(client));
			isAuthenticated.set(true);
		}
	} catch (e) {
		// eslint-disable-next-line
		console.error(e);
	} finally {
		popupOpen.set(false);
	}
}

function logout(client: Auth0Client, options: LogoutOptions) {
	return client.logout(options);
}

async function getUserRole(client: Auth0Client | null): Promise<UserTypes> {
	if (client != null) {
		const data = await client.getIdTokenClaims();
		if (data) {
			const rolesArr: string[] = data[`${vars.auth0.audience}/roles`];

			switch (rolesArr[0]) {
				case 'owner':
					return UserTypes.Owner;
				case 'provider':
					return UserTypes.Provider;
				case 'refugee':
					return UserTypes.Refugee;
			}
		}
	}

	return UserTypes.Undefined;
}

const auth = {
	createClient,
	loginWithPopup,
	loginWithRedirect,
	logout,
	getUserRole
};

export default auth;
