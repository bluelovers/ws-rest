/**
 * Created by user on 2019/6/8.
 */

import { AxiosRequestConfig, AxiosTransformer } from 'axios';
import { IPropertyKey } from 'reflect-metadata-util';
import { getConfig, setConfig } from './util';
import merge from '../../util/merge';
import { ITSValueOrArray } from 'ts-type';
import LazyURLSearchParams from 'http-form-urlencoded';

export function RequestConfigs<K extends keyof AxiosRequestConfig>(value: Partial<K | AxiosRequestConfig>)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		let config = getConfig(target, propertyName);

		config = merge(config || {}, value);

		setConfig(config, target, propertyName);
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

		merge(config, {

			transformRequest: fn,

		} as AxiosRequestConfig);

		setConfig(config, target, propertyName);
	}
}

export default RequestConfig;
