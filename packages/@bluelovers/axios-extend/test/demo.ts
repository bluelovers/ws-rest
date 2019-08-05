/**
 * Created by user on 2019/8/5.
 */

import { extendAxios } from '@node-novel/axios-extend'
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
