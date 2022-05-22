export const vars = {
	auth0: {
		domain: import.meta.env.VITE_AUTH0_DOMAIN,
		clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
		audience: import.meta.env.VITE_AUTH0_AUDIENCE
	},
	api: {
		baseUrl: import.meta.env.VITE_API_BASE_URL as string
	}
};
