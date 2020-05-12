import { LazyCookieJar } from 'lazy-cookies';
import ApiClient from '../lib';
import { _getApiClient } from '@node-novel/site-cache-util/lib/client';
import { __path } from './util/files';
import { EnumMirrorSites } from '../lib/mirror';

let api: ApiClient;
let saveCache: () => void;
let jar: LazyCookieJar;

export async function getApiClient()
{
	const baseURL = EnumMirrorSites.SOUTH_PLUS;

	({ api, saveCache, jar } = await _getApiClient({
		api,
		saveCache,
		ApiClient,
		__path,
		jar,
		envPrefix: 'SOUTH_PLUS',
		apiOptions: {
			baseURL,
		},
	}));

	return {
		api,
		saveCache,
	};
}
