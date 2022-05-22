import { UserTypes } from './types';
import type { Auth0Client, User } from '@auth0/auth0-spa-js';
import { writable, type Writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user: Writable<User> = writable({});
export const userType: Writable<UserTypes> = writable(UserTypes.Undefined);
export const popupOpen = writable(false);
export const error = writable();
export const auth0Client: Writable<Auth0Client | null> = writable(null);
