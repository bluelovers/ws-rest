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
import { DmzjClient as ApiClient } from 'dmzj-api';
import fs from 'fs-extra';
import path from "upath2";
import { exportCache, IBaseCacheStore, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { console, consoleDebug } from '@node-novel/site-cache-util/lib';
import { dotValue } from '@bluelovers/axios-util';
import { getResponseUrl } from '@bluelovers/axios-util/lib/index';
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
		envPrefix: 'DMZJ',
		apiOptions: {
			cache: {
				maxAge: 25 * 60 * 60 * 1000,
			},
		}
	}));

	return {
		api,
		saveCache,
	};
}

export { getApiClient as getDmzjClient }

export function trim(input: string)
{
	return input
		.replace(/^\s+|\s+$/gu, '')
		.replace(/\r|\n|[\u00A0]/gu, ' ')
		.replace(/\s+/gu, ' ')
		.trim()
}
