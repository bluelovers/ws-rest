import RequestConfig from './config';
import { IParameterDecorator, IPropertyKey } from 'reflect-metadata-util';
import { getConfig, setConfig } from './config/util';
import merge from '../util/merge';
import urlNormalize, { IUrlLike } from '../util/url';

export const enum EnumMethod
{
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
	HEAD = 'HEAD',
}

const _methods = ([
	EnumMethod.GET,
	EnumMethod.POST,
	EnumMethod.PUT,
	EnumMethod.PATCH,
	EnumMethod.DELETE,
	EnumMethod.HEAD,
] as const);

export function _buildMethod(method: EnumMethod)
{
	return function (url?: IUrlLike): MethodDecorator
	{
		if (url != null)
		{
			url = urlNormalize(url);
		}

		return function (target: any, propertyName?: IPropertyKey)
		{
			const config = getConfig(target, propertyName);

			if (url != null)
			{
				config.url = url;
			}

			config.method = method;

			setConfig(config, target, propertyName);
		};
	};
}

const { GET, POST, PUT, PATCH, DELETE, HEAD } = _methods.reduce((a, key) =>
{
	a[key] = _buildMethod(key);
	return a;
}, {} as Record<EnumMethod, (url?: IUrlLike) => MethodDecorator>);

export { GET, POST, PUT, PATCH, DELETE, HEAD };

export default { GET, POST, PUT, PATCH, DELETE, HEAD };
