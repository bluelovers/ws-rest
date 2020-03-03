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
import { default as ApiClient } from 'discuz-api/lib';
import fs from 'fs-extra';
import path from "upath2";
import { exportCache, IBaseCacheStore, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { console, consoleDebug } from '@node-novel/site-cache-util/lib';
import { dotValue } from '@bluelovers/axios-util';
import { getResponseUrl } from '@bluelovers/axios-util/lib/index';
import { LazyCookieJar } from 'lazy-cookies';

import { deserializeCookieJar } from 'restful-decorator-plugin-jsdom/lib/cookies';
import { IPasswordLocal } from '@node-novel/site-cache-util/lib/types';
import importPassword from '@node-novel/site-cache-util/lib/pass';
import isCi from '@node-novel/site-cache-util/lib/ci';

export { consoleDebug, console }

import { __root, cacheFilePaths, __path } from './util/files';
import { _setupCacheFile, _getApiClient } from '@node-novel/site-cache-util/lib/client';
export { __root };

let api: ApiClient;
let saveCache: () => void;
let jar: LazyCookieJar;

export async function getApiClient()
{
	let baseURL = 'https://masiro.moe/';

	({ api, saveCache, jar } = await _getApiClient({
		api,
		saveCache,
		ApiClient,
		// @ts-ignore
		__path,
		jar,
		envPrefix: 'MASIRO',
		apiOptions: {
			baseURL,
//			cache: {
//				maxAge: 24 * 60 * 60 * 1000,
//			},
		},
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
