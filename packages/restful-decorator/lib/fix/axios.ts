/**
 * Created by user on 2019/6/10.
 */
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import LazyURL from 'lazy-url';

export function getAxiosBaseURL(config: AxiosRequestConfig, axios: AxiosInstance)
{
	let { baseURL } = config;

	if (baseURL == null)
	{
		baseURL = axios.defaults.baseURL
	}

	return baseURL;
}

export function combineURLs(relativeURL: string, baseURL: string)
{
	return new LazyURL(relativeURL, baseURL).toRealString();
}

export function fixAxiosCombineURLs(url: string, config: AxiosRequestConfig, axios: AxiosInstance)
{
	let baseURL = getAxiosBaseURL(config, axios);

	if (baseURL != null)
	{
		return combineURLs(url, baseURL)
	}

	return url;
}
