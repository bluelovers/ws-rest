import fs from 'fs-extra';
import { exportCache, importCache, processExitHook } from 'axios-cache-adapter-util';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import consoleDebug from 'restful-decorator/lib/util/debug';

export async function setupCacheFile(options?: {
	store: IBaseCacheStore | object,
	saveCacheFileBySelf?: boolean,
	cacheFile: string,
})
{
	const { saveCacheFileBySelf, cacheFile, store } = options || {};

	const now = Date.now() + 3600;

	await fs.readJSON(cacheFile)
		.catch(e => {
			return {}
		})
		.then(async (json) => {

			let len = await (store as IBaseCacheStore).length();

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

			let len2 = await (store as IBaseCacheStore).length();

			consoleDebug.log(`before: ${len}`, `after: ${len2}`);
		})
	;

	function saveCache()
	{
		return exportCache(store, (json) => {
			fs.outputJSONSync(cacheFile, json, {
				spaces: 2,
			});

			consoleDebug.debug(`[Cache]`, Object.keys(json).length, `saved`, cacheFile);

		})
	}

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