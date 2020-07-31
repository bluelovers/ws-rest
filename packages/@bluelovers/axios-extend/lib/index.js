"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAdapter = exports.mixinCacheConfig = exports.mixinDefaultConfig = exports.setupCacheConfig = exports.extendAxios = void 0;
const lodash_1 = require("lodash");
const bluebird_1 = __importDefault(require("bluebird"));
const retry_axios_1 = require("retry-axios");
const axios_cookiejar_support_1 = __importDefault(require("axios-cookiejar-support"));
const cache_1 = __importStar(require("./cache"));
exports.setupCacheConfig = cache_1.default;
Object.defineProperty(exports, "mixinCacheConfig", { enumerable: true, get: function () { return cache_1.mixinCacheConfig; } });
const config_1 = require("./config");
Object.defineProperty(exports, "mixinDefaultConfig", { enumerable: true, get: function () { return config_1.mixinDefaultConfig; } });
const axios_util_1 = require("@bluelovers/axios-util");
__exportStar(require("./types"), exports);
// @ts-ignore
const unset_value_1 = __importDefault(require("unset-value"));
function extendAxios(axios, defaultOptions) {
    axios = axios_cookiejar_support_1.default(axios);
    retry_axios_1.attach(axios);
    if (axios_util_1.isAxiosStatic(axios)) {
        let old = axios.create;
        axios.create = function (config, ...argv) {
            if (config == null) {
                config = lodash_1.cloneDeep(this.defaults);
            }
            unset_value_1.default(config, 'raxConfig.currentRetryAttempt');
            let o = old.call(this, config, ...argv);
            lodash_1.merge(o.defaults, {
                raxConfig: {
                    instance: o,
                }
            });
            retry_axios_1.attach(o);
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
            return config_1.mixinDefaultConfig(config, _axios, defaultOptions, ...opts);
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