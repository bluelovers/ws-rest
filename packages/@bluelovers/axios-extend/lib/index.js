"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAdapter = exports.mixinCacheConfig = exports.mixinDefaultConfig = exports.setupCacheConfig = exports.extendAxios = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const retry_axios_1 = require("retry-axios");
const axios_cookiejar_support_1 = (0, tslib_1.__importDefault)(require("axios-cookiejar-support"));
const cache_1 = (0, tslib_1.__importStar)(require("./cache"));
exports.setupCacheConfig = cache_1.default;
Object.defineProperty(exports, "mixinCacheConfig", { enumerable: true, get: function () { return cache_1.mixinCacheConfig; } });
const config_1 = require("./config");
Object.defineProperty(exports, "mixinDefaultConfig", { enumerable: true, get: function () { return config_1.mixinDefaultConfig; } });
const axios_util_1 = require("@bluelovers/axios-util");
(0, tslib_1.__exportStar)(require("./types"), exports);
// @ts-ignore
const unset_value_1 = (0, tslib_1.__importDefault)(require("unset-value"));
function extendAxios(axios, defaultOptions) {
    axios = (0, axios_cookiejar_support_1.default)(axios);
    (0, retry_axios_1.attach)(axios);
    if ((0, axios_util_1.isAxiosStatic)(axios)) {
        let old = axios.create;
        axios.create = function (config, ...argv) {
            if (config == null) {
                config = (0, lodash_1.cloneDeep)(this.defaults);
            }
            (0, unset_value_1.default)(config, 'raxConfig.currentRetryAttempt');
            let o = old.call(this, config, ...argv);
            (0, lodash_1.merge)(o.defaults, {
                raxConfig: {
                    instance: o,
                }
            });
            (0, retry_axios_1.attach)(o);
            return o;
        };
    }
    return {
        axios,
        /**
         * only use this method once for each axios, if not will create new cache
         */
        setupCacheConfig: cache_1.default,
        mixinCacheConfig: cache_1.mixinCacheConfig,
        mixinDefaultConfig(config, _axios = axios, ...opts) {
            return (0, config_1.mixinDefaultConfig)(config, _axios, defaultOptions, ...opts);
        },
    };
}
exports.extendAxios = extendAxios;
function wrapAdapter(fn, config) {
    const old = config.adapter;
    if (old) {
        return function (config) {
            return bluebird_1.default.resolve(old.call(this, config))
                .bind(this)
                .then((returnValue) => {
                return fn.call(this, config, returnValue);
            });
        };
    }
    return bluebird_1.default.method(fn);
}
exports.wrapAdapter = wrapAdapter;
exports.default = extendAxios;
//# sourceMappingURL=index.js.map