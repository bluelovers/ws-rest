
import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { IPropertyKey } from 'reflect-metadata-util';
import { ITSOverwrite } from 'ts-type';

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
		//headers?: any | IHttpheaders;
	}

	interface AxiosResponse<T = any>
	{
		headers: any | IHttpheaders;
		request?: any | IAxiosResponseClientRequest;
	}
}


