/**
 * Created by user on 2019/8/5.
 */

import { extendAxios, IAxiosCacheAdapterOptions, mixinCacheConfig, IBluebird, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, IAxiosAdapterWarpper, IAxiosDefaultsHeaders, IAxiosResponseClientRequest, IAxiosRetryConfig, IBluebirdAxiosResponse, IHttpheaders, IHttpheadersValues, IUnpackAxiosResponse, IUnpackedPromiseLikeReturnType, setupCacheConfig, wrapAdapter } from '../lib'
import _axios from 'axios';

{
	// 3

	const ret = extendAxios(_axios);

	let axios = ret.axios;
	let setupCacheConfig = ret.setupCacheConfig;
	let mixinCacheConfig = ret.mixinCacheConfig;

	let a = axios.create(setupCacheConfig({

		cache: {
			maxAge: 3600,
		},

	}).config);

	console.dir(a)

}
