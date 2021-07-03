"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCacheFile = void 0;
const fs_extra_1 = require("fs-extra");
const index_1 = require("./index");
const debug_1 = require("restful-decorator/lib/util/debug");
const free_gc_1 = require("free-gc");
async function setupCacheFile(options) {
    const { saveCacheFileBySelf, cacheFile, store } = options || {};
    const now = Date.now() + 3600;
    await (0, fs_extra_1.readJSON)(cacheFile)
        .catch(e => {
        return {};
    })
        .then(async (json) => {
        let len = await store.length();
        await (0, index_1.importCache)(store, json, {
            importFilter(k, v) {
                return v;
            }
        });
        let len2 = await store.length();
        debug_1.consoleDebug.log(`before: ${len}`, `after: ${len2}`);
    });
    (0, free_gc_1.freeGC)();
    function saveCache() {
        return (0, index_1.exportCache)(store, (json) => {
            (0, free_gc_1.freeGC)();
            (0, fs_extra_1.outputJSONSync)(cacheFile, json, {
                spaces: 2,
            });
            (0, free_gc_1.freeGC)();
            debug_1.consoleDebug.debug(`[Cache]`, Object.keys(json).length, `saved`, cacheFile);
        });
    }
    saveCache.store = store;
    if (!saveCacheFileBySelf) {
        await (0, index_1.processExitHook)(() => {
            debug_1.consoleDebug.debug(`processExitHook`);
            return saveCache();
        });
    }
    return saveCache;
}
exports.setupCacheFile = setupCacheFile;
exports.default = setupCacheFile;
//# sourceMappingURL=setup.js.map