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
import { Wenku8Client as ApiClient } from 'wenku8-api';
import fs from 'fs-extra';
import path from "upath2";
import { exportCache, IBaseCacheStore, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { console, consoleDebug } from '@node-novel/site-cache-util/lib';
import { dotValue } from '@bluelovers/axios-util';
import { getResponseUrl } from '@bluelovers/axios-util/lib/index';
import { CookieJar } from 'tough-cookie';
import { LazyCookieJar } from 'lazy-cookies';
import { deserializeCookieJar } from 'wenku8-api/lib/util';
import Wenku8Client from 'wenku8-api/lib/index';
import { IPasswordLocal } from '@node-novel/site-cache-util/lib/types';
import importPassword from '@node-novel/site-cache-util/lib/pass';

export { consoleDebug, console }

export const __root = path.join(__dirname, '..');

let api: ApiClient;
let saveCache: () => void;
let jar: LazyCookieJar;

const cookiesCacheFile = path.join(__root, 'test/temp', 'axios.cookies.json');

export async function getApiClient()
{
	if (api == null)
	{
		let setting = {
			cache: {
				maxAge: 12 * 60 * 60 * 1000,
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

		};

		if (fs.existsSync(cookiesCacheFile))
		{


			consoleDebug.debug(`axios.cookies.json 已存在，嘗試載入內容`);

			api = await fs.readJSON(cookiesCacheFile)
				.then(r => deserializeCookieJar(r))
				.then(_jar => {
					if (_jar)
					{
						consoleDebug.debug(jar = _jar as LazyCookieJar);

						return new ApiClient({
							...setting,
							jar: _jar,
						})
					}
				})
				.catch(e => {
					console.error(e);
					return null;
				})
			;
		}

		if (!api)
		{
			api = new ApiClient(setting);
		}

		let isLogin = await api.isLogin();
		console.info('isLogin', isLogin);

		if (!isLogin)
		{
			consoleDebug.debug(`目前為未登入狀態，嘗試使用帳號密碼登入`);

			let { default: localPassword, DISABLE_LOGIN } = await importPassword({
				file: 'test/password.local',
				__root,
				envPrefix: 'wenku8',
			});

			if (DISABLE_LOGIN)
			{
				consoleDebug.red.info(`[DISABLE_LOGIN] 選項已啟用，忽略使用帳密登入`);
			}
			else
			{
				await api.loginByForm({
						...localPassword,
					})
					// @ts-ignore
					.then(r => console.dir(r))
				;

				console.info('isLogin', await api.isLogin());
			}
		}

		saveCache = await setupCacheFile(api);
	}

	return {
		api,
		saveCache,
	};
}

async function setupCacheFile(api: ApiClient, saveCacheFileBySelf?: boolean)
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
		{
			api.cookiesRemoveTrack();

			let json = api._serialize();

			//consoleDebug.dir(json);

			fs.writeJSONSync(cookiesCacheFile, json, {
				spaces: 2,
			})
		}

		return exportCache(store, (json) => {
			fs.outputJSONSync(cacheFile, json, {
				//spaces: 2,
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
