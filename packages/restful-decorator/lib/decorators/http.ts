/**
 * Created by user on 2019/6/7.
 */
import 'reflect-metadata';

import { IPropertyKey } from 'reflect-metadata-util';
import { _buildMethod, EnumMethod } from './method';
import urlNormalize, { IUrlLike } from '../util/url';

export const enum EnumRestClientMetadata
{
	PARAM_CACHE = 'PARAM_CACHE',

	PARAM_PATH = 'Path',
	PARAM_QUERY = 'Query',
	PARAM_DATA = 'Data',
	PARAM_BODY = 'Body',
	PARAM_HEADER = 'Header',

	METHOD_GET = 'GET',
	METHOD_POST = 'POST',
	METHOD_PUT = 'PUT',
	METHOD_PATCH = 'PATCH',
	METHOD_DELETE = 'DELETE',
	METHOD_HEAD = 'HEAD',

	METHOD = 'METHOD',
	BASE_URL = 'BASE_URL',

	DEFAULT_HEADERS = 'DEFAULT_HEADERS',

	HTTP_CLIENT = 'HTTP_CLIENT',
	REQUEST_INTERCEPTOR = 'REQUEST_INTERCEPTOR',

}

export function BaseUrl(url: IUrlLike)
{
	return Reflect.metadata(EnumRestClientMetadata.BASE_URL, urlNormalize(url));
}
