/**
 * Created by user on 2019/6/8.
 */

import { AxiosRequestConfig } from '../../types/axios';
import { AxiosTransformer } from 'axios';
import { getMetadataLazy, IPropertyKey } from 'reflect-metadata-util';
import { getConfig, setConfig, SymConfig } from './util';
import merge from '../../util/merge';
import { ITSValueOrArray } from 'ts-type';
import LazyURLSearchParams from 'http-form-urlencoded';
import consoleDebug from '../../util/debug';

export function RequestConfigs<K extends AxiosRequestConfig>(value: Partial<K | AxiosRequestConfig>)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		let config = getConfig(target, propertyName);

		config = merge(config || {}, value);

		setConfig(config, target, propertyName);

		//consoleDebug.info(`RequestConfigs`, value);
	};
}

export function RequestConfig<K extends keyof AxiosRequestConfig>(key: K, value: AxiosRequestConfig[K], mergeMode?: boolean)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		const config = getConfig(target, propertyName);

		if (mergeMode)
		{
			config[key] = merge(config[key] || {}, value);
		}
		else
		{
			config[key] = value;
		}

		setConfig(config, target, propertyName);
	};
}

/**
 * 越晚執行的放越上面
 *
 * @param {ITSValueOrArray<AxiosTransformer>} fn
 * @returns {(target: any, propertyName?: IPropertyKey) => void}
 * @constructor
 */
export function TransformRequest(fn: ITSValueOrArray<AxiosTransformer>)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		const config = getConfig(target, propertyName);

		if (config.transformRequest && !Array.isArray(config.transformRequest))
		{
			config.transformRequest = [config.transformRequest];
		}

		if (!Array.isArray(fn))
		{
			fn = [fn];
		}

		config.transformRequest = config.transformRequest || [];

		config.transformRequest.push(...fn);

		//console.dir(config.transformRequest);

//		merge(config, {
//
//			transformRequest: fn,
//
//		} as AxiosRequestConfig);

		setConfig(config, target, propertyName);
	}
}

/**
 * 越晚執行的放越上面
 */
export function TransformResponse(fn: ITSValueOrArray<AxiosTransformer>)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		const config = getConfig(target, propertyName);

		if (config.transformResponse && !Array.isArray(config.transformResponse))
		{
			config.transformResponse = [config.transformResponse];
		}

		if (!Array.isArray(fn))
		{
			fn = [fn];
		}

		config.transformResponse = config.transformResponse || [];

		config.transformResponse.push(...fn);

		//console.dir(config.transformRequest);

//		merge(config, {
//
//			transformRequest: fn,
//
//		} as AxiosRequestConfig);

		setConfig(config, target, propertyName);
	}
}

export default RequestConfig;
