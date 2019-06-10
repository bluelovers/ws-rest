import { AxiosRequestConfig, AxiosResponse, AxiosTransformer } from 'axios';
import RequestConfig from './config';
import { IHttpheaders, IAxiosResponseClientRequest } from '../types/axios';
import { getConfig, setConfig } from './config/util';
import merge from '../util/merge';
import { IPropertyKey } from 'reflect-metadata-util';
import LazyURLSearchParams from 'http-form-urlencoded';
import { TransformRequest } from './config/index';

export const enum EnumAuthorizationType
{
	Bearer = 'Bearer',
	Token = 'token',
	Basic = 'Basic',
}

export function Headers(value: IHttpheaders)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		const config = getConfig(target, propertyName);

		if (0 && propertyName == null)
		{
			config.headers = config.headers || {};
			config.headers.common = merge(config.headers.common || {}, value);
		}
		else
		{
			config.headers = merge(config.headers || {}, value);
		}

		setConfig(config, target, propertyName);
	};
}

export function Authorization(value: string, type?: string | EnumAuthorizationType)
{
	return Headers({
		Authorization: _makeAuthorizationValue(value, type)
	});
}

export function _makeAuthorizationValue(value: string, type?: string | EnumAuthorizationType)
{
	if (type != null && type != '')
	{
		value = type + ' ' + value;
	}
	else if (!value.includes(' '))
	{
		value = EnumAuthorizationType.Basic + ' ' + value;
	}

	return value;
}
