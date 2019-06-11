import { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosAdapter, AxiosPromise } from 'axios';
import { IPropertyKey } from 'reflect-metadata-util';
import { ITSOverwrite, ITSUnpackedPromiseLike } from 'ts-type';
import _axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';
import { CookieJar } from 'tough-cookie';
import { IBluebird } from '../index';
import { IAxiosCacheAdapterOptions, setupCache } from 'axios-cache-adapter';
import Bluebird from 'bluebird';

// @ts-ignore
import * as CombineURLs from 'axios/lib/helpers/combineURLs';
import { IResponseHeaders, ILazyHeaders } from 'typed-http-headers';

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
}

export type IHttpheadersValues = string | number | boolean | string[];

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
	}

	interface AxiosResponse<T = any>
	{
		headers: AxiosResponse["headers"] | IHttpheaders;
		request?: AxiosResponse["request"] | IAxiosResponseClientRequest;
	}
}

declare module 'axios'
{
	interface AxiosRequestConfig
	{
		/**
		 * configure how the cached requests will be handled, where they will be stored, etc.
		 */
		cache?: IAxiosCacheAdapterOptions;

		/**
		 * force cache invalidation
		 */
		clearCacheEntry?: boolean;
	}
}

export const axios = axiosCookieJarSupport(_axios) as typeof _axios;
export default axios;

export { AxiosRequestConfig, AxiosResponse, AxiosInstance }

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
