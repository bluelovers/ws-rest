import { LazyCookieJar } from 'lazy-cookies';
import ApiClient from '../lib';
import { _getApiClient } from '@node-novel/site-cache-util/lib/client';
import { __path } from './util/files';

let api: ApiClient;
let saveCache: () => void;
let jar: LazyCookieJar;

export async function getApiClient()
{
	const baseURL = 'https://loveheaven.net/';

	({ api, saveCache, jar } = await _getApiClient({
		api,
		saveCache,
		ApiClient,
		__path,
		jar,
		envPrefix: 'LHSCAN_API',
		apiOptions: {
			baseURL,
		},
	}));

	return {
		api,
		saveCache,
	};
}
