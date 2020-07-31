import { AxiosAdapter, AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import { IResponseHeaders } from 'typed-http-headers';
import Bluebird from 'bluebird';
import { ITSPartialPick, ITSUnpackedPromiseLike } from 'ts-type';
import { RetryConfig as IAxiosRetryConfig } from 'retry-axios';
import { IPropertyKey } from 'reflect-metadata-util';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import { FollowResponse } from 'follow-redirects';
import { ITSOverwrite } from 'ts-type/lib/type/record';
export declare type IBluebird<T> = Bluebird<T>;
export declare type IHttpheadersValues = string | number | boolean | string[];
export interface IHttpheaders extends Record<string | keyof IResponseHeaders, IHttpheadersValues> {
    Accepts?: 'application/json' | string | string[];
    Referer?: string;
    'Content-Type'?: string;
    'Authorization'?: string;
    'x-auth-token'?: string;
    'Set-Cookie'?: string[];
}
export interface IAxiosDefaultsHeaders extends Partial<Record<'common' | 'delete' | 'get' | 'post' | 'put' | 'patch', IHttpheaders>> {
}
export declare type IUnpackAxiosResponse<T> = T extends PromiseLike<AxiosResponse<infer U>> ? U : T extends AxiosResponse<infer U> ? U : never;
export declare type IBluebirdAxiosResponse<T = any> = IBluebird<AxiosResponse<T>>;
export declare type IUnpackedPromiseLikeReturnType<T extends (...args: any) => any> = ITSUnpackedPromiseLike<ReturnType<T>>;
export interface IAxiosAdapterWarpper {
    (config: AxiosRequestConfig, returnValue: AxiosResponse<any>): AxiosPromise<any>;
}
export interface IAxiosResponseClientRequest extends Record<IPropertyKey, any> {
    res?: ITSOverwrite<FollowResponse, {
        responseUrl?: FollowResponse["responseUrl"];
        redirects?: FollowResponse["redirects"];
        headers?: IHttpheaders;
        rawHeaders?: string[];
    }>;
    path?: string;
    method?: string;
    finished?: boolean;
    fromCache?: boolean;
}
declare module 'axios-cache-adapter' {
    interface IAxiosCacheAdapterOptions {
        excludeFromCache?: boolean;
    }
}
declare module 'axios' {
    interface AxiosRequestConfigHeaders extends IHttpheaders {
    }
    interface AxiosInstance {
    }
    interface AxiosRequestConfig {
        /**
         * configure how the cached requests will be handled, where they will be stored, etc.
         */
        cache?: IAxiosCacheAdapterOptions;
        /**
         * force cache invalidation
         */
        clearCacheEntry?: boolean;
        headers?: AxiosRequestConfig["headers"] | IHttpheaders;
        /**
         * @see https://www.npmjs.com/package/retry-axios
         * @deprecated
         */
        raxConfig?: IAxiosRetryConfig;
    }
    interface AxiosResponse<T = any> {
        headers: AxiosResponse<T>["headers"] | IHttpheaders;
        request?: AxiosResponse<T>["request"] | IAxiosResponseClientRequest;
    }
    interface AxiosError<T = any> {
        request?: AxiosError<T>["request"] | IAxiosResponseClientRequest;
    }
}
export interface IAxiosCacheAdapterOptionsConfig extends ITSPartialPick<AxiosRequestConfig, 'cache' | 'clearCacheEntry'> {
}
export { IAxiosCacheAdapterOptions, IAxiosRetryConfig, AxiosAdapter, AxiosPromise };
export { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError, AxiosStatic };
