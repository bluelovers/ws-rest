"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixinDefaultConfig = void 0;
const lodash_1 = require("lodash");
const cache_1 = require("./cache");
function mixinDefaultConfig(config, axios, ...defaultOptions) {
    let raxConfig = {
        retry: 0,
        retryDelay: 250,
    };
    if (axios) {
        raxConfig.instance = axios;
    }
    config = (0, cache_1.mixinCacheConfig)((0, lodash_1.defaultsDeep)(config, ...defaultOptions, {
        raxConfig,
    }));
    return config;
}
exports.mixinDefaultConfig = mixinDefaultConfig;
exports.default = mixinDefaultConfig;
//# sourceMappingURL=config.js.map