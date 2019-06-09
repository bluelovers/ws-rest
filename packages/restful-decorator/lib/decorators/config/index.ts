/**
 * Created by user on 2019/6/8.
 */

import { AxiosRequestConfig } from 'axios';
import { IPropertyKey } from 'reflect-metadata-util';
import { getConfig, setConfig } from './util';
import merge from '../../util/merge';

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

export default RequestConfig;
