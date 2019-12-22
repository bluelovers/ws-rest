/**
 * Created by user on 2019/12/22.
 */

import path from "path";
import ApiClient from '../../lib/index';
import { CookieJar } from 'tough-cookie';
import fs from 'fs-extra';
import localPassword, { DISABLE_LOGIN } from '../password.local';
import { setupCacheFile } from 'axios-cache-adapter-util/lib/setup';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import consoleDebug, { console } from 'restful-decorator/lib/util/debug';
import { deserializeCookieJar } from 'restful-decorator-plugin-jsdom/lib/cookies';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';

export const __root = path.join(__dirname, '../..');
export const COOKIES_CACHE_FILE = path.join(__root, 'test/temp', 'axios.cookies.json');
export const AXIOS_CACHE_FILE = path.join(__root, 'test/temp', 'axios.cache.json');

export const DEV_BASE_URL = 'https://masiro.moe/';

export async function setupDevClient(baseURL = DEV_BASE_URL)
{
	let api: ApiClient;
	let jar: CookieJar;

	if (fs.existsSync(COOKIES_CACHE_FILE))
	{
		consoleDebug.debug(`axios.cookies.json 已存在，嘗試載入內容`);

		api = await fs.readJSON(COOKIES_CACHE_FILE)
			.then(r => deserializeCookieJar(r))
			.then(_jar =>
			{
				if (_jar)
				{
					consoleDebug.debug(jar = _jar);

					return new ApiClient({
						jar: _jar,
						baseURL,
					})
				}
			})
			.catch(e =>
			{
				console.error(e);
				return null;
			})
		;
	}

	if (!api)
	{
		api = new ApiClient({
			baseURL,
		});
	}

	let isLogin = await api.isLogin();
	consoleDebug.info('isLogin', isLogin);

//	console.log('isLogin2', await api.isLogin2());

	if (!isLogin)
	{
		consoleDebug.debug(`目前為未登入狀態，嘗試使用帳號密碼登入`);

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
		}
	}

	await setupCacheFile({
		store: getAxiosCacheAdapter(api).store as IBaseCacheStore,
		cacheFile: AXIOS_CACHE_FILE,
	})
	;

	return {
		api,
		saveDevCacheFile()
		{

			let json = api._serialize();
			return fs.outputJSON(COOKIES_CACHE_FILE, json)
		},
	};
}

export default setupDevClient
