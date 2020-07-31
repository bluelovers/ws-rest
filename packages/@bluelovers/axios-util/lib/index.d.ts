import { AxiosError, AxiosInstance, AxiosStatic, AxiosResponse } from 'axios';
import { Options as IDotValueOptions } from 'get-value';
export declare function dotValue<T>(obj: T): T;
export declare function dotValue<V extends unknown, T extends object = object>(obj: T, key: string | string[], options?: IDotValueOptions): V;
export declare function dotValue(obj: object, key: string | string[], options?: IDotValueOptions): unknown;
export declare function isAxiosStatic(axios: AxiosInstance | AxiosStatic): axios is AxiosStatic;
export declare function isAxiosError(err: Error | AxiosError): err is AxiosError;
/**
 * @see https://github.com/RasCarlito/axios-cache-adapter
 */
export declare function isResponseFromAxiosCache(rp: AxiosResponse): boolean;
export declare function getResponseUrl(rp: AxiosResponse): string;
export declare function getResponseRedirects(rp: AxiosResponse): string;
export declare function getAxiosErrorResponseData<T extends AxiosError>(err: T): unknown;
export default dotValue;
