/**
 * Created by user on 2019/6/8.
 */

import { AxiosRequestConfig } from 'axios';
import { merge, mergeClone } from './merge';
import { getMetadataLazy, IPropertyKey } from 'reflect-metadata-util';
import { EnumRestClientMetadata } from '../decorators/http';
import { getConfig, SymConfig } from '../decorators/config/util';
import LazyURL from 'lazy-url';
import urlNormalize from './url';
import { getParamMetadata } from '../decorators/body';

export function _getSetting<T extends AxiosRequestConfig = AxiosRequestConfig>(thisArgv: object,
	requestConfig: T,
	propertyName?: IPropertyKey,
)
{
	const baseURL = getMetadataLazy(EnumRestClientMetadata.BASE_URL, thisArgv, propertyName);

	if (propertyName == null)
	{
		merge(requestConfig, getMetadataLazy(SymConfig, thisArgv));
	}

	if (baseURL != null)
	{
		// @ts-ignore
		requestConfig.baseURL = urlNormalize(baseURL);
	}

	const config = getConfig(thisArgv, propertyName);

	//console.log(555);

	//console.dir(config);

	merge(requestConfig, config);

	//console.dir(requestConfig);

	return requestConfig;
}

export function _chkSettingUpdate<T extends AxiosRequestConfig = AxiosRequestConfig>(defaults: T, opts: T)
{
	let bool: boolean;

	const ks = Object.keys(opts) as (keyof T)[];

	if (ks.length)
	{
		ks
			.forEach(function (k)
			{
				if (typeof opts[k] !== 'undefined' && opts[k] !== defaults[k])
				{
					bool = true;
				}
			})
		;

		if (bool)
		{
			//console.dir(opts);

			defaults = mergeClone<AxiosRequestConfig>(defaults, opts);

			fixRequestConfig(defaults);

			//console.dir(defaults);
		}
	}

	return {
		bool,
		requestConfigNew: defaults,
	};
}

export function fixRequestConfig<T extends AxiosRequestConfig = AxiosRequestConfig>(requestConfig: T)
{
	if (typeof requestConfig.method === 'string')
	{
		// @ts-ignore
		requestConfig.method = requestConfig.method.toUpperCase();
	}

	if (requestConfig.method === 'GET')
	{
		if (requestConfig.data)
		{
			requestConfig.params = merge<AxiosRequestConfig["params"]>(requestConfig.params, requestConfig.data);

			delete requestConfig.data;
		}
	}

	return requestConfig;
}
