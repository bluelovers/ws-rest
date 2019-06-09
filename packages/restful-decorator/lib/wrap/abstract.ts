import 'reflect-metadata';
import createMethodBuilder from './decorators/build';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { _chkSettingUpdate, _getSetting, fixRequestConfig } from '../util/config';
import subobject from '../helper/subobject';
import { IUrlLike } from '../util/url';
import { Once } from 'lodash-decorators';
import { mergeClone } from '../util/merge';
import { _habdleParamInfo, _ParamInfoToArgv, getParamMetadata, IParameter, IParamMetadata } from '../decorators/body';
import { IHandleDescriptorReturn2 } from '../decorators/build';
import { EnumRestClientMetadata } from '../decorators/http';
import routerToRfc6570 from 'router-uri-convert';
// @ts-ignore
import { URI as routerURI } from 'uri-template-lite';
import { includesKey } from '../util/util';
import { axios, IAxiosDefaultsHeaders } from '../types/axios';
import { IPropertyKey } from 'reflect-metadata-util';
import CookieJarSupport from '../decorators/config/cookies';

export interface IAbstractHttpClientCache
{
	requestConfig: AxiosRequestConfig,
	bool: boolean,
	requestConfigNew: AxiosRequestConfig,
	paramMetadata: IParamMetadata,
}

export const methodBuilder = createMethodBuilder<any, IAbstractHttpClientCache>(function (data)
{
	let {
		target,
		propertyName,
		thisArgv,
		method,
		argv,
	} = data;

	const requestConfig = _getSetting<AxiosRequestConfig>(thisArgv, {}, propertyName);

	let paramMetadata = getParamMetadata(thisArgv, propertyName);

	paramMetadata = _habdleParamInfo({
		paramMetadata,
		argv,
	});

	argv = _ParamInfoToArgv(paramMetadata, argv);

	const { bool, requestConfigNew } = _chkSettingUpdate<AxiosRequestConfig>({}, requestConfig);

	if (thisArgv.$parent == null || thisArgv.$parent === thisArgv)
	{
		thisArgv = subobject({}, thisArgv);
	}

	const _ret = paramMetadataRequestConfig({
		requestConfig: requestConfigNew,
		paramMetadata,
	});

	thisArgv.$pathData = _ret.pathData;
	thisArgv.$url = _ret.url;
	thisArgv.$requestConfig = _ret.requestConfig;

	delete data.requestConfigNew;

	return <IHandleDescriptorReturn2<AbstractHttpClient, IAbstractHttpClientCache>>{
		...data,
		requestConfig: requestConfigNew,
		thisArgv,
		paramMetadata,
		argv,
	};
});

@CookieJarSupport(true)
export class AbstractHttpClient
{
	public $parent: this = null;
	public $http: AxiosInstance = axios.create();
	public $requestConfig: AxiosRequestConfig = {};
	public $url: IUrlLike;
	public $pathData: Record<string, string>;
	public $returnValue: AxiosResponse<unknown>;
	public $responseUrl: string;
	public $sharedPreferences = new Map<IPropertyKey, unknown>();

	constructor(defaults?: AxiosRequestConfig)
	{
		this.$http = axios.create(this._init(defaults));

		this.$http.defaults.headers.common.Authorization;
	}

	@Once
	protected _init(defaults?: AxiosRequestConfig)
	{
		const opts = mergeClone<AxiosRequestConfig>({}, _getSetting(this, {}), defaults);

		const headers = opts.headers as IAxiosDefaultsHeaders;

		if (headers && !includesKey(headers, [
			'common',
			'delete',
			'get',
			'patch',
			'post',
			'put',
		]))
		{
			opts.headers = {
				...headers,
				common: headers,
			};
		}

		return opts;
	}

}

export function paramMetadataRequestConfig(_argv: {
	paramMetadata: IParamMetadata,
	requestConfig: AxiosRequestConfig,
})
{
	let { paramMetadata, requestConfig } = _argv;

	const pathData: Record<string, string> = {};

	Object.keys(paramMetadata)
		.forEach(function (key: keyof IParamMetadata)
		{

			let arr: IParameter[];

			switch (key)
			{
				case 'Body':

					requestConfig.data = paramMetadata[key].value;

					break;
				case 'Data':

					arr = paramMetadata[key];

					requestConfig.data = requestConfig.data || {};

					arr.forEach((row) => {
						requestConfig.data[row.key] = row.value;
					});

					break;
				case 'Header':

					arr = paramMetadata[key];

					requestConfig.headers = requestConfig.headers || {};

					arr.forEach((row) => {
						requestConfig.headers[row.key] = row.value;
					});

					break;
				case 'Path':

					arr = paramMetadata[key];

					arr.forEach((row) => {
						pathData[row.key] = row.value as any;
					});

					break;
				case 'Query':

					arr = paramMetadata[key];

					requestConfig.params = requestConfig.params || {};

					arr.forEach((row) => {
						requestConfig.params[row.key] = row.value;
					});

					break;
			}

		})
		;

	requestConfig = fixRequestConfig(requestConfig);

	const url = requestConfig.url;

	if (url != null)
	{
		requestConfig.url = routerURI.expand(routerToRfc6570(url), pathData);
	}

	//console.dir(requestConfig.url);

	return {
		/**
		 * url before expanded
		 */
		url,
		/**
		 * for router url
		 */
		pathData,
		/**
		 * merged request config
		 */
		requestConfig,
	};
}
