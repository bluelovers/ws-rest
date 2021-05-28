import { outputJSONSync, readJSON } from 'fs-extra';
import { exportCache, importCache, processExitHook } from './index';
import { IBaseCacheStore } from './index';
import { consoleDebug } from 'restful-decorator/lib/util/debug';
import { ICacheStoreJsonItem, ICacheStoreJsonRow } from './index';
import { freeGC } from 'free-gc';

export async function setupCacheFile(options?: {
	store: IBaseCacheStore | object,
	saveCacheFileBySelf?: boolean,
	cacheFile: string,
})
{
	const { saveCacheFileBySelf, cacheFile, store } = options || {};

	const now = Date.now() + 3600;

	await readJSON(cacheFile)
		.catch(e => {
			return {}
		})
		.then(async (json) => {

			let len = await (store as IBaseCacheStore).length();

			await importCache(store, json, {
				importFilter(k: string, v)
				{
					return v;
				}
			});

			let len2 = await (store as IBaseCacheStore).length();

			consoleDebug.log(`before: ${len}`, `after: ${len2}`);
		})
	;

	freeGC();

	function saveCache()
	{
		return exportCache(store, (json) => {
			freeGC();
			outputJSONSync(cacheFile, json, {
				spaces: 2,
			});
			freeGC();

			consoleDebug.debug(`[Cache]`, Object.keys(json).length, `saved`, cacheFile);

		})
	}

	saveCache.store = store;

	if (!saveCacheFileBySelf)
	{
		await processExitHook(() => {
			consoleDebug.debug(`processExitHook`);
			return saveCache();
		});
	}

	return saveCache
}

export default setupCacheFile
