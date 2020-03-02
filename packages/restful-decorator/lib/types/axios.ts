import _axios from 'axios';
import { extendAxios, IAxiosCacheAdapterOptions, mixinCacheConfig, IBluebird, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, IAxiosAdapterWarpper, IAxiosDefaultsHeaders, IAxiosResponseClientRequest, IAxiosRetryConfig, IBluebirdAxiosResponse, IHttpheaders, IHttpheadersValues, IUnpackAxiosResponse, IUnpackedPromiseLikeReturnType, setupCacheConfig, wrapAdapter, AxiosAdapter, AxiosPromise, AxiosStatic } from '@bluelovers/axios-extend';

export const axios = extendAxios(_axios).axios;
export default axios;

export * from '@bluelovers/axios-extend'

export { extendAxios, IAxiosCacheAdapterOptions, mixinCacheConfig, IBluebird, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, IAxiosAdapterWarpper, IAxiosDefaultsHeaders, IAxiosResponseClientRequest, IAxiosRetryConfig, IBluebirdAxiosResponse, IHttpheaders, IHttpheadersValues, IUnpackAxiosResponse, IUnpackedPromiseLikeReturnType, setupCacheConfig, wrapAdapter, AxiosAdapter, AxiosPromise, AxiosStatic };
