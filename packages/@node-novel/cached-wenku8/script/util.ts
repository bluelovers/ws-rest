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
	({ api, saveCache, jar } = await _getApiClient({
		api,
		saveCache,
		ApiClient,
		__path,
		jar,
		envPrefix: 'WENKU8',
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
