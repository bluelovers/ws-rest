/**
 * Created by user on 2019/7/7.
 */

import ApiClient from 'esjzone-api/lib/index';
import { console, consoleDebug } from '@node-novel/site-cache-util/lib';
import { LazyCookieJar } from 'lazy-cookies';

export { consoleDebug, console }

import { __root, cacheFilePaths, __path } from './util/files';
import { _setupCacheFile, _getApiClient } from '@node-novel/site-cache-util/lib/client';
export { __root };

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
		envPrefix: 'ESJZONE',
		apiOptions: {
			cache: {
				maxAge: 6 * 60 * 60 * 1000,
			},
		}
	}));

	return {
		api,
		saveCache,
	};
}

export function trim(input: string)
{
	return input
		.replace(/^\s+|\s+$/gu, '')
		.replace(/\r|\n|[\u00A0]/gu, ' ')
		.replace(/\s+/gu, ' ')
		.trim()
}
