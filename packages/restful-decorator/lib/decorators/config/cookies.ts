/**
 * Created by user on 2019/6/10.
 */
import RequestConfig, { RequestConfigs } from './index';
import { AxiosRequestConfig } from '../../types/axios';
import toughCookie, { CookieJar } from 'tough-cookie';
import { getMetadataLazy, getPrototypeOfConstructor, IPropertyKey } from 'reflect-metadata-util';
import { getConfig, SymConfig } from './util';
import { ICookiesValue, ICookiesValueInput, LazyCookieJar } from 'lazy-cookies';

export function CookieJarSupport(value: AxiosRequestConfig["jar"] | CookieJar)
{
	if (value === true)
	{
		value = new LazyCookieJar();
	}

	return RequestConfigs({
		jar: value,
		withCredentials: true,
	})
}

export function SetCookies<T extends string>(data: ICookiesValueInput<T>, url?: string | URL)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		const jar = getCookieJar(target, propertyName);

		jar.setData(data, url)
	}
}

export function getCookieJar(target: any, propertyName?: IPropertyKey): LazyCookieJar
{
	let config = getMetadataLazy(SymConfig, target, propertyName);

	if (!config || !config.jar)
	{
		config = getMetadataLazy(SymConfig, target)
	}

	if (!config || !config.jar)
	{
		throw new ReferenceError(`axios-cookiejar-support not enable`)
	}

	return config.jar
}

export default CookieJarSupport
