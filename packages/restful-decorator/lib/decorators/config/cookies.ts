/**
 * Created by user on 2019/6/10.
 */
import RequestConfig, { RequestConfigs } from './index';
import { AxiosRequestConfig } from '../../types/axios';
import { CookieJar } from 'tough-cookie';
import { IPropertyKey } from 'reflect-metadata-util';

export function CookieJarSupport(value: AxiosRequestConfig["jar"] | CookieJar)
{
	if (value === true)
	{
		value = new CookieJar();
	}

	return RequestConfigs({
		jar: value,
		withCredentials: true,
	})
}

export function SetCookie()
{

}

export default CookieJarSupport
