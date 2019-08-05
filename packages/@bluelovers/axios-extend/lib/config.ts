import { AxiosRequestConfig, AxiosInstance } from './types';
import { merge, defaultsDeep } from 'lodash';
import { mixinCacheConfig } from './cache';

export function mixinDefaultConfig<T extends AxiosRequestConfig>(config: T, axios?: AxiosInstance, ...defaultOptions: AxiosRequestConfig[]): AxiosRequestConfig
{
	let raxConfig: AxiosRequestConfig["raxConfig"] = {
		retry: 0,
		retryDelay: 250,
	};

	if (axios)
	{
		raxConfig.instance = axios
	}

	config = mixinCacheConfig(defaultsDeep(config, ...defaultOptions, <AxiosRequestConfig>{
		raxConfig,
	}));

	return config
}

export default mixinDefaultConfig
