import { AxiosError, AxiosInstance, AxiosStatic, AxiosResponse } from 'axios';
import getValue, { Options as IDotValueOptions } from 'get-value';

export function dotValue<T>(obj: T): T;
export function dotValue<V extends unknown, T extends object = object>(obj: T, key: string | string[], options?: IDotValueOptions): V;
export function dotValue(obj: object, key: string | string[], options?: IDotValueOptions): unknown;
export function dotValue(...argv: [any, any?, any?])
{
	return getValue(...argv)
}

export function isAxiosStatic(axios: AxiosInstance | AxiosStatic): axios is AxiosStatic
{
	let tmp = axios as AxiosStatic;

	return (typeof tmp.create === 'function') && (typeof tmp.request === 'function') && (typeof tmp.all === 'function') && (typeof tmp.spread === 'function')
}

export function isAxiosError(err: Error | AxiosError): err is AxiosError
{
	let e = err as AxiosError;
	return (err instanceof Error) && e.config && (e.request || e.response);
}

/**
 * @see https://github.com/RasCarlito/axios-cache-adapter
 */
export function isResponseFromAxiosCache(rp: AxiosResponse): boolean
{
	return dotValue(rp, 'request.fromCache')
}

export function getResponseUrl(rp: AxiosResponse): string
{
	return dotValue(rp, 'request.res.responseUrl')
}

export function getResponseRedirects(rp: AxiosResponse): string
{
	return dotValue(rp, 'request.res.redirects')
}

export function getAxiosErrorResponseData<T extends AxiosError>(err: T)
{
	return dotValue(err, 'response.data')
}

export default dotValue
