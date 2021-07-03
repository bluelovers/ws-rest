"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._setupCacheFile = void 0;
const cache_1 = require("restful-decorator/lib/decorators/config/cache");
const fs_extra_1 = require("fs-extra");
const index_1 = require("../index");
const axios_cache_adapter_util_1 = require("axios-cache-adapter-util");
async function _setupCacheFile(opts) {
    const { api, saveCacheFileBySelf, __path } = opts;
    const { cacheFilePaths } = __path;
    const store = (0, cache_1.getAxiosCacheAdapter)(api).store;
    const cacheFile = cacheFilePaths.axiosCacheFile;
    const now = Date.now() + 3600;
    await (0, fs_extra_1.readJSON)(cacheFile)
        .catch(e => {
        return {};
    })
        .then(async (json) => {
        let len = await store.length();
        index_1.consoleDebug.debug(__path.relative(cacheFile), 'length:', Object.keys(json).length);
        await (0, axios_cache_adapter_util_1.importCache)(store, json, {
            importFilter(k, v) {
                if (now >= v.expires) {
                    //v.expires = now;
                }
                let { status } = v.data;
                if (status != 200) {
                    index_1.consoleDebug.debug(`[importCache]`, String(status).padStart(3, '0'), k);
                }
                return v;
            },
        });
        let len2 = await store.length();
        index_1.console.magenta.log(`before: ${len}`, `after: ${len2}`);
    });
    let len = await store.length();
    function saveCache() {
        // @ts-ignore
        if (typeof api._serialize === 'function') {
            // @ts-ignore
            if (typeof api.cookiesRemoveTrack === 'function') {
                // @ts-ignore
                api.cookiesRemoveTrack();
            }
            // @ts-ignore
            let json = api._serialize();
            //consoleDebug.dir(json);
            (0, fs_extra_1.outputJSONSync)(cacheFilePaths.cookiesCacheFile, json, {
                spaces: 2,
            });
        }
        return (0, axios_cache_adapter_util_1.exportCache)(store, (json) => {
            (0, fs_extra_1.outputJSONSync)(cacheFile, json, {
            //spaces: 2,
            });
            let len2 = Object.keys(json).length;
            index_1.console.magenta.debug(`[Cache]`, len2, `saved`, __path.relative(cacheFile));
            index_1.console.red.log(`before: ${len}`, `after: ${len2}`);
        });
    }
    if (!saveCacheFileBySelf) {
        await (0, axios_cache_adapter_util_1.processExitHook)(() => {
            index_1.console.magenta.success(`processExitHook`);
            return saveCache();
        });
    }
    return saveCache;
}
exports._setupCacheFile = _setupCacheFile;
//# sourceMappingURL=save.js.map