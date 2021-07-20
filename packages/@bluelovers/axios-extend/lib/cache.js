"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixinCacheConfig = exports.setupCacheConfig = exports.setupCache = void 0;
const tslib_1 = require("tslib");
const axios_cache_adapter_1 = require("axios-cache-adapter");
Object.defineProperty(exports, "setupCache", { enumerable: true, get: function () { return axios_cache_adapter_1.setupCache; } });
const lodash_1 = require("lodash");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const createCacheStoreByMapLike_1 = require("axios-cache-adapter-util/lib/createCacheStoreByMapLike");
const lru_cache2_1 = (0, tslib_1.__importDefault)(require("lru-cache2"));
const key_1 = require("axios-cache-adapter-util/lib/util/key");
function setupCacheConfig(configInput) {
    var _a;
    var _b;
    configInput = mixinCacheConfig(configInput);
    (_a = (_b = configInput.cache).store) !== null && _a !== void 0 ? _a : (_b.store = (() => {
        const lru = new lru_cache2_1.default({
            max: 500,
        });
        const store = new createCacheStoreByMapLike_1.CacheStoreByMapLike(lru);
        return store;
    })());
    const cache = (0, axios_cache_adapter_1.setupCache)(configInput.cache);
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
        config.cache = (0, lodash_1.defaultsDeep)(config.cache, {
            exclude: {
                filter(res) {
                    return res.status >= 500;
                }
            },
            key: key_1.defaultAxiosCacheAdapterKeyFixed,
        });
    }
    return config;
}
exports.mixinCacheConfig = mixinCacheConfig;
exports.default = setupCacheConfig;
//# sourceMappingURL=cache.js.map