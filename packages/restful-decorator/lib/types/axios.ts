import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { IPropertyKey } from 'reflect-metadata-util';
import { ITSOverwrite, ITSUnpackedPromiseLike } from 'ts-type';
import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';
import { CookieJar } from 'tough-cookie';
import { IBluebird } from '../index';

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

export interface IHttpheaders extends Record<string, IHttpheadersValues>
{
	Accepts?: 'application/json' | string | string[],
	Referer?: string,
	'content-type'?: string,
	'Authorization'?: string,
	'x-auth-token'?: string,
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

axiosCookieJarSupport(axios);

export { AxiosRequestConfig, AxiosResponse, AxiosInstance }

export type IUnpackAxiosResponse<T> =
	T extends PromiseLike<AxiosResponse<infer U>> ? U :
		T extends AxiosResponse<infer U> ? U :
			never
	;

export type IBluebirdAxiosResponse<T = any> = IBluebird<AxiosResponse<T>>;

export type IUnpackedPromiseLikeReturnType<T extends (...args: any) => any> = ITSUnpackedPromiseLike<ReturnType<T>>;

export { axios }
export default axios;
