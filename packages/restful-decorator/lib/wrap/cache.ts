
import { AxiosRequestConfig } from '../types/axios';
import { AxiosAdapter } from 'axios';
import { defaultsDeep } from 'lodash';
import Bluebird from 'bluebird';
import { setupCacheConfig, mixinCacheConfig, IAxiosCacheAdapterOptions, IAxiosCacheAdapterOptionsConfig, ISetupCache, setupCache } from '@bluelovers/axios-extend/lib/cache';

export { setupCacheConfig, mixinCacheConfig, IAxiosCacheAdapterOptions, IAxiosCacheAdapterOptionsConfig, ISetupCache, setupCache }

export default setupCacheConfig
