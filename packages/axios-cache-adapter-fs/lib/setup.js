"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCacheFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const axios_cache_adapter_util_1 = require("axios-cache-adapter-util");
const debug_1 = __importDefault(require("restful-decorator/lib/util/debug"));
async function setupCacheFile(options) {
    const { saveCacheFileBySelf, cacheFile, store } = options || {};
    const now = Date.now() + 3600;
    await fs_extra_1.default.readJSON(cacheFile)
        .catch(e => {
        return {};
    })
        .then(async (json) => {
        let len = await store.length();
        await axios_cache_adapter_util_1.importCache(store, json, {
            importFilter(k, v) {
                return v;
            }
        });
        let len2 = await store.length();
        debug_1.default.log(`before: ${len}`, `after: ${len2}`);
    });
    function saveCache() {
        return axios_cache_adapter_util_1.exportCache(store, (json) => {
            fs_extra_1.default.outputJSONSync(cacheFile, json, {
                spaces: 2,
            });
            debug_1.default.debug(`[Cache]`, Object.keys(json).length, `saved`, cacheFile);
        });
    }
    saveCache.store = store;
    if (!saveCacheFileBySelf) {
        await axios_cache_adapter_util_1.processExitHook(() => {
            debug_1.default.debug(`processExitHook`);
            return saveCache();
        });
    }
    return saveCache;
}
exports.setupCacheFile = setupCacheFile;
exports.default = setupCacheFile;
//# sourceMappingURL=setup.js.map