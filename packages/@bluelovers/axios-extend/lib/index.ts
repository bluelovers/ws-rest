
import { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosAdapter, AxiosPromise, AxiosError, AxiosStatic } from 'axios';
import _axios from 'axios';
import Bluebird from 'bluebird';
import { RetryConfig as IAxiosRetryConfig, attach as RaxAttach } from 'retry-axios';
import { IResponseHeaders, ILazyHeaders } from 'typed-http-headers';
import { IPropertyKey } from 'reflect-metadata-util';
import { ITSUnpackedPromiseLike } from 'ts-type';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { IAxiosCacheAdapterOptions, setupCache } from 'axios-cache-adapter';
import setupCacheConfig, { IAxiosCacheAdapterOptionsConfig, mixinCacheConfig } from './cache';

export type IBluebird<T> = Bluebird<T>

export type IHttpheadersValues = string | number | boolean | string[];

export { IAxiosCacheAdapterOptions, IAxiosRetryConfig, AxiosAdapter, AxiosPromise }

export interface IHttpheaders extends Record<string | keyof IResponseHeaders, IHttpheadersValues>
{
	Accepts?: 'application/json' | string | string[],
	Referer?: string,
	'Content-Type'?: string,
	'Authorization'?: string,
	'x-auth-token'?: string,
	'Set-Cookie'?: string[],
}

export interface IAxiosDefaultsHeaders extends Partial<Record<'common' | 'delete' | 'get' | 'post' | 'put' | 'patch', IHttpheaders>>
{

}

export interface IAxiosResponseClientRequest extends Record<IPropertyKey, any>
{
	res?: {
		responseUrl?: string,
		redirects?: string[],
		headers?: IHttpheaders,
		rawHeaders?: string[],
	},
	path?: string,
	method?: string,
	finished?: boolean,

	fromCache?: boolean,
}

declare module 'axios'
{

	interface AxiosRequestConfigHeaders extends IHttpheaders
	{

	}

	interface AxiosInstance
	{

	}

	interface AxiosRequestConfig
	{
		headers?: AxiosRequestConfig["headers"] | IHttpheaders;
		/**
		 * @see https://www.npmjs.com/package/retry-axios
		 */
		raxConfig?: IAxiosRetryConfig;
	}

	interface AxiosResponse<T = any>
	{
		headers: AxiosResponse["headers"] | IHttpheaders;
		request?: AxiosResponse["request"] | IAxiosResponseClientRequest;
	}

	interface AxiosError<T = any>
	{
		//config: AxiosError<T>["config"]
		request?: AxiosError<T>["request"] | IAxiosResponseClientRequest;
	}
}

export { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError, AxiosStatic }

export function extendAxios<AX extends AxiosInstance | AxiosStatic>(axios: AX)
{
	RaxAttach(axios);

	axios = axiosCookieJarSupport(axios) as AX;

	return {
		axios,
		/**
		 * only use this method once for each axios, if not will create new cache
		 */
		setupCacheConfig,
		mixinCacheConfig,
	}
}

export { setupCacheConfig }

export { mixinCacheConfig }

export type IUnpackAxiosResponse<T> =
	T extends PromiseLike<AxiosResponse<infer U>> ? U :
		T extends AxiosResponse<infer U> ? U :
			never
	;

export type IBluebirdAxiosResponse<T = any> = IBluebird<AxiosResponse<T>>;

export type IUnpackedPromiseLikeReturnType<T extends (...args: any) => any> = ITSUnpackedPromiseLike<ReturnType<T>>;

export interface IAxiosAdapterWarpper
{
	(config: AxiosRequestConfig, returnValue: AxiosResponse<any>): AxiosPromise<any>;
}

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