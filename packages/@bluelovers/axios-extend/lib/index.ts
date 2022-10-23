import {
	AxiosAdapter,
	AxiosError,
	AxiosInstance,
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosStatic,
} from 'axios';
import { merge, defaultsDeep, cloneDeep } from 'lodash';
import Bluebird from 'bluebird';
import { attach as RaxAttach, RetryConfig as IAxiosRetryConfig } from '@bluelovers/retry-axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import setupCacheConfig, { mixinCacheConfig } from './cache';
import { IAxiosAdapterWarpper } from './types';
import { mixinDefaultConfig } from './config';
import { isAxiosStatic } from '@bluelovers/axios-util';
export * from "./types";
// @ts-ignore
import unsetValue from 'unset-value';

export { IAxiosCacheAdapterOptions, IAxiosRetryConfig, AxiosAdapter, AxiosPromise }
export { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError, AxiosStatic }

export function extendAxios<AX extends AxiosInstance | AxiosStatic>(axios: AX, defaultOptions?: AxiosRequestConfig)
{
	axios = axiosCookieJarSupport(axios) as AX;

	RaxAttach(axios);

	if (isAxiosStatic(axios))
	{
		let old = axios.create;

		axios.create = function (config, ...argv)
		{
			if (config == null)
			{
				config = cloneDeep(this.defaults);
			}

			unsetValue(config, 'raxConfig.currentRetryAttempt');

			let o = old.call(this, config, ...argv);

			merge(o.defaults, <AxiosRequestConfig>{
					raxConfig: {
						instance: o,
					}
				})
			;

			RaxAttach(o);

			return o;
		}
	}

	return {
		axios,
		/**
		 * only use this method once for each axios, if not will create new cache
		 */
		setupCacheConfig,
		mixinCacheConfig,
		mixinDefaultConfig<T extends AxiosRequestConfig>(config: T, _axios: AxiosInstance = axios, ...opts: AxiosRequestConfig[]): AxiosRequestConfig
		{
			return mixinDefaultConfig(config, _axios, defaultOptions, ...opts)
		},
	}
}

export { setupCacheConfig, mixinDefaultConfig, mixinCacheConfig }

export function wrapAdapter(fn: IAxiosAdapterWarpper, config: AxiosRequestConfig)
{
	const old = config.adapter;

	if (old)
	{
		return function (this: ThisType<AxiosInstance>, config: AxiosRequestConfig)
		{
			return Bluebird.resolve(old.call(this, config))
				.bind(this)
				.then((returnValue) => {
					return fn.call(this, config, returnValue)
				})
				;
		}
	}

	return Bluebird.method(fn)
}

export default extendAxios
