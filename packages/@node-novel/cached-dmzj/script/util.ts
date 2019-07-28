/**
 * Created by user on 2019/7/7.
 */

import { DmzjClient } from 'dmzj-api';
import fs from 'fs-extra';
import path from 'path';
import { exportCache, IBaseCacheStore, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { console, consoleDebug } from 'restful-decorator/lib/util/debug';

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

			console.debug(`[Cache]`, Object.keys(json).length, `saved`, cacheFile);

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
