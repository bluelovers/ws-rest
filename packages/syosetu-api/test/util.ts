import { LazyCookieJar } from 'lazy-cookies';
import { _getApiClient } from '@node-novel/site-cache-util/lib/client';
import { __path } from './files';
import ApiClient from '../lib/index';

let api: ApiClient;
let saveCache: () => void;
let jar: LazyCookieJar;

export async function getApiClient()
{
	({ api, saveCache, jar } = await _getApiClient({
		api,
		saveCache,
		ApiClient,
		__path,
		jar,
		envPrefix: 'SYOSETU',
	}));

	return {
		api,
		saveCache,
	};
}

