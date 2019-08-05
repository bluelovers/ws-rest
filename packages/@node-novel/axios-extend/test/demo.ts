/**
 * Created by user on 2019/8/5.
 */

import { extendAxios } from '@node-novel/axios-extend'
import _axios from 'axios';

{
	// 1

	const { axios, setupCacheConfig, mixinCacheConfig } = extendAxios(_axios);

	axios;

	axios.create(setupCacheConfig({

		cache: {
			maxAge: 3600,
		},

	}).config);
}

{
	// 2

	const ret = extendAxios(_axios);

	let { axios, setupCacheConfig, mixinCacheConfig } = ret;

	axios;

	axios.create(setupCacheConfig({

		cache: {
			maxAge: 3600,
		},

	}).config);
}

{
	// 3

	const ret = extendAxios(_axios);

	let axios = ret.axios;
	let setupCacheConfig = ret.setupCacheConfig;
	let mixinCacheConfig = ret.mixinCacheConfig;

	axios;

	axios.create(setupCacheConfig({

		cache: {
			maxAge: 3600,
		},

	}).config);
}
