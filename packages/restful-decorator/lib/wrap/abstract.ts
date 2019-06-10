import 'reflect-metadata';
import createMethodBuilder from './decorators/build';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { _chkSettingUpdate, _getSetting, fixRequestConfig } from '../util/config';
import subobject from '../helper/subobject';
import { IUrlLike } from '../util/url';
import { Once } from 'lodash-decorators';
import { mergeClone } from '../util/merge';
import {
	_habdleParamInfo,
	_ParamInfoToArgv,
	getParamMetadata,
	IEnumRestClientMetadataParam,
	IEnumRestClientMetadataParamMap,
	IParameter,
	IParamMetadata,
} from '../decorators/body';
import { IHandleDescriptorReturn2 } from '../decorators/build';
import { EnumRestClientMetadata } from '../decorators/http';
import routerToRfc6570 from 'router-uri-convert';
// @ts-ignore
import { URI as routerURI } from 'uri-template-lite';
import { includesKey } from '../util/util';
import { axios, IAxiosDefaultsHeaders } from '../types/axios';
import { IPropertyKey } from 'reflect-metadata-util';
import CookieJarSupport from '../decorators/config/cookies';
import { LazyCookieJar } from 'lazy-cookies';
import { fixAxiosCombineURLs } from '../fix/axios';
import parseRouterVars from 'router-uri-convert/parser';

export interface IAbstractHttpClientCache
{
	requestConfig: AxiosRequestConfig,
	bool: boolean,
	requestConfigNew: AxiosRequestConfig,
	paramMetadata: IParamMetadata,
	router: string,
	pathData: Record<string, string>,
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
		thisArgv: thisArgv as any,
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
		router: thisArgv.$url,
		pathData: _ret.pathData,
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

	constructor(defaults?: AxiosRequestConfig, ...argv: any)
	{
		this.$http = axios.create(defaults = this._init(defaults, ...argv));

		// @FIXME fix miss jar field
		this.$http.defaults.jar = defaults.jar;

		//console.dir(this.$http.defaults.jar);

		//this.$http.defaults.headers.common.Authorization;
	}

	@Once
	protected _init(defaults?: AxiosRequestConfig, ...argv: any)
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

	get $jar(): LazyCookieJar
	{
		//return getCookieJar(this, propertyName);
		return this.$http.defaults.jar as any
	}

	get $baseURL(): string
	{
		return this.$http.defaults.baseURL
	}

}

export function paramMetadataRequestConfig(_argv: {
	paramMetadata: IParamMetadata,
	requestConfig: AxiosRequestConfig,
	thisArgv: object,
})
{
	let { paramMetadata, requestConfig, thisArgv } = _argv;

	const pathData: Record<string, string> = {};
	const autoData: Record<string, unknown> = {};

	Object.keys(paramMetadata)
		.forEach(function (key: IEnumRestClientMetadataParam | IEnumRestClientMetadataParamMap)
		{
			let arr: IParameter[];

			switch (key)
			{
				case EnumRestClientMetadata.PARAM_BODY:

					requestConfig.data = paramMetadata[key].value;

					break;
				case EnumRestClientMetadata.PARAM_DATA:

					arr = paramMetadata[key];

					requestConfig.data = requestConfig.data || {};

					arr.forEach((row) =>
					{
						requestConfig.data[row.key] = row.value;
					});

					break;
				case EnumRestClientMetadata.PARAM_HEADER:

					arr = paramMetadata[key];

					requestConfig.headers = requestConfig.headers || {};

					arr.forEach((row) =>
					{
						requestConfig.headers[row.key] = row.value;
					});

					break;
				case EnumRestClientMetadata.PARAM_PATH:

					arr = paramMetadata[key];

					arr.forEach((row) =>
					{
						pathData[row.key] = row.value as any;
					});

					break;
				case EnumRestClientMetadata.PARAM_QUERY:

					arr = paramMetadata[key];

					requestConfig.params = requestConfig.params || {};

					arr.forEach((row) =>
					{
						requestConfig.params[row.key] = row.value;
					});

					break;

				case EnumRestClientMetadata.PARAM_MAP_AUTO:

					arr = paramMetadata[key];

					arr.forEach((row) =>
					{
						Object.assign(autoData, row.value);
					});

					break;
				case EnumRestClientMetadata.PARAM_MAP_PATH:

					arr = paramMetadata[key];

					arr.forEach((row) =>
					{
						Object.assign(pathData, row.value);
					});

					break;

				case EnumRestClientMetadata.PARAM_MAP_BODY:
				case EnumRestClientMetadata.PARAM_MAP_DATA:
				case EnumRestClientMetadata.PARAM_MAP_HEADER:
				case EnumRestClientMetadata.PARAM_MAP_QUERY:

					arr = paramMetadata[key];

					let targetField: keyof Pick<AxiosRequestConfig, 'params' | 'headers' | 'data'>;

					switch (key)
					{
						case EnumRestClientMetadata.PARAM_MAP_BODY:
						case EnumRestClientMetadata.PARAM_MAP_DATA:
							targetField = 'data';
							break;
						case EnumRestClientMetadata.PARAM_MAP_HEADER:
							targetField = 'headers';
							break;
						case EnumRestClientMetadata.PARAM_MAP_QUERY:
							targetField = 'params';
							break;
					}

					requestConfig[targetField] = requestConfig[targetField] || {};

					arr.forEach((row) =>
					{
						Object.assign(requestConfig[targetField], row.value)
					});

					break;
			}

		})
	;

	requestConfig = fixRequestConfig(requestConfig);

	const url = requestConfig.url;

	if (url != null)
	{
		//console.dir(url);
		//console.dir(pathData);
		//console.dir(routerToRfc6570(url));

		let tpl = routerToRfc6570(url);

		let ks1 = parseRouterVars(tpl);
		let ks2 = Object.keys(autoData);

		let ret = ks2.reduce((a, k) => {

			if (ks1.includes(k))
			{
				a.expand[k] = autoData[k];
			}
			else
			{
				a.data[k] = autoData[k];
			}

			return a;
		}, {
			expand: {} as Record<string, unknown>,
			data: {} as Record<string, unknown>,
		});

		Object.assign(pathData, ret.expand);

		requestConfig.url = routerURI.expand(tpl, pathData);

		if (Object.keys(ret.data).length)
		{
			requestConfig.data = requestConfig.data || {};

			Object.assign(requestConfig.data, ret.data);
		}
	}
	else if (Object.keys(autoData).length)
	{
		requestConfig.data = requestConfig.data || {};
		Object.assign(requestConfig.data, autoData);
	}

	requestConfig.url = fixAxiosCombineURLs(requestConfig.url, requestConfig, (thisArgv as AbstractHttpClient).$http);

	//console.dir(requestConfig.url);

	requestConfig = fixRequestConfig(requestConfig);

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
