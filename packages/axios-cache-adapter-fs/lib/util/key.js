"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosCacheAdapterKeyExtra = exports.defaultAxiosCacheAdapterKeyFixed = void 0;
const tslib_1 = require("tslib");
const md5_1 = (0, tslib_1.__importDefault)(require("md5"));
const axios_cache_adapter_1 = require("axios-cache-adapter");
const lazy_url_1 = require("lazy-url");
/**
 * bug fixed version of key
 *
 * @see https://github.com/RasCarlito/axios-cache-adapter/blob/master/src/cache.js#L66
 * @see https://github.com/RasCarlito/axios-cache-adapter/pull/250
 */
function defaultAxiosCacheAdapterKeyFixed(req) {
    const url = new lazy_url_1.LazyURL(req.url, req.baseURL).toRealString();
    const key = url + (0, axios_cache_adapter_1.serializeQuery)(req);
    return req.data ? key + (0, md5_1.default)(req.data) : key;
}
exports.defaultAxiosCacheAdapterKeyFixed = defaultAxiosCacheAdapterKeyFixed;
function axiosCacheAdapterKeyExtra(cb) {
    return (req) => {
        return defaultAxiosCacheAdapterKeyFixed(cb(req));
    };
}
exports.axiosCacheAdapterKeyExtra = axiosCacheAdapterKeyExtra;
//# sourceMappingURL=key.js.map