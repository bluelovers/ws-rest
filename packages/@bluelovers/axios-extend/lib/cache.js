"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixinCacheConfig = exports.setupCacheConfig = exports.setupCache = void 0;
const axios_cache_adapter_1 = require("axios-cache-adapter");
Object.defineProperty(exports, "setupCache", { enumerable: true, get: function () { return axios_cache_adapter_1.setupCache; } });
const lodash_1 = require("lodash");
const bluebird_1 = __importDefault(require("bluebird"));
function setupCacheConfig(configInput) {
    configInput = mixinCacheConfig(configInput);
    const cache = axios_cache_adapter_1.setupCache(configInput.cache);
    const config = {
        ...configInput,
        adapter: bluebird_1.default.method(cache.adapter),
    };
    // @ts-ignore
    delete config.cache;
    return {
        config,
        cache,
    };
}
exports.setupCacheConfig = setupCacheConfig;
function mixinCacheConfig(config) {
    if (config.cache != null && typeof config.cache === 'object') {
        config.cache = lodash_1.defaultsDeep(config.cache, {
            exclude: {
                filter(res) {
                    return res.status >= 500;
                }
            }
        });
    }
    return config;
}
exports.mixinCacheConfig = mixinCacheConfig;
exports.default = setupCacheConfig;
//# sourceMappingURL=cache.js.map