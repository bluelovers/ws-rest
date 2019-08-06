/**
 * Created by user on 2019/7/7.
 */

import {
	AxiosAdapter,
	AxiosError,
	AxiosInstance,
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosStatic,
} from 'axios';
import { DmzjClient } from 'dmzj-api';
import fs from 'fs-extra';
import path from "upath2";
import { exportCache, IBaseCacheStore, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { console, consoleDebug } from 'restful-decorator/lib/util/debug';
import { dotValue } from 'axios-util';
import { getResponseUrl } from 'axios-util/lib/index';

export { consoleDebug, console }

export const __root = path.join(__dirname, '..');

let api: DmzjClient;
let saveCache: () => void;

export async function getDmzjClient()
{
	if (api == null)
	{
		api = new DmzjClient({
			cache: {
				maxAge: 24 * 60 * 60 * 1000,
			},

			raxConfig: {
				retry: 1,
				retryDelay: 1000,

				onRetryAttempt: (err: AxiosError) => {

					let currentRetryAttempt = dotValue(err, 'config.raxConfig.currentRetryAttempt');

					consoleDebug.debug(`Retry attempt #${currentRetryAttempt}`, getResponseUrl(err.response));
				}

			},

//			proxy: {
//				host: '49.51.155.45',
//				port: 8081,
//			},

		});
		saveCache = await setupCacheFile(api);
	}

	return {
		api,
		saveCache,
	};
}

async function setupCacheFile(api: DmzjClient, saveCacheFileBySelf?: boolean)
{
	const store = getAxiosCacheAdapter(api).store as IBaseCacheStore;

	const cacheFile = path.join(__root, 'test/temp', 'axios.cache.json');

	const now = Date.now() + 3600;

	await fs.readJSON(cacheFile)
		.catch(e => {
			return {}
		})
		.then(async (json) => {

			let len = await store.length();

			await importCache(store, json, {
				importFilter(k, v)
				{
					if (now >= v.expires)
					{
						//v.expires = now;
					}

					let { status } = v.data;

					if (status != 200)
					{
						consoleDebug.debug(`[importCache]`, String(status).padStart(3, '0'), k);
					}

					return v;
				}
			});

			let len2 = await store.length();

			console.log(`before: ${len}`, `after: ${len2}`);
		})
	;

	function saveCache()
	{
		return exportCache(store, (json) => {
			fs.outputJSONSync(cacheFile, json, {
				spaces: 2,
			});

			console.debug(`[Cache]`, Object.keys(json).length, `saved`, path.relative(path.join(__dirname, '..'), cacheFile));

		})
	}

	if (!saveCacheFileBySelf)
	{
		await processExitHook(() => {
			console.debug(`processExitHook`);
			return saveCache();
		});
	}

	return saveCache
}

export function trim(input: string)
{
	return input
		.replace(/^\s+|\s+$/gu, '')
		.replace(/\r|\n|[\u00A0]/gu, ' ')
		.replace(/\s+/gu, ' ')
		.trim()
}
