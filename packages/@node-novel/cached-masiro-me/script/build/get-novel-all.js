"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const util_1 = require("../util");
const files_1 = require("../util/files");
const fs_extra_1 = require("fs-extra");
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const path_1 = require("path");
const free_gc_1 = require("free-gc");
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const index_2 = require("@bluelovers/axios-util/lib/index");
const util_2 = require("../util/util");
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    const file_recentUpdate = files_1.cacheFilePaths.recentUpdate;
    const file_task001 = files_1.cacheFilePaths.task001;
    let recentUpdateList = await (0, fs_extra_1.readJSON)(file_recentUpdate);
    let cacheTask001 = await (0, fs_extra_1.readJSON)(file_task001)
        .catch(e => ({}));
    let boolCache = null;
    await bluebird_1.default
        .resolve(recentUpdateList.list)
        .mapSeries(async (row, index, length) => {
        const { id } = row;
        const _file = (0, files_1.cacheFileInfoPath)(id);
        if (await (0, fs_extra_1.pathExists)(_file) && cacheTask001[id]) {
            index_1.consoleDebug.gray.debug(`[SKIP]`, (0, util_2.printIndexLabel)(index, length), id, row.title, (0, moment_1.moment)(cacheTask001[id])
                .format(), row.last_update_name);
            return;
        }
        await api.bookInfo(id)
            .catchReturn(null)
            .tap(novel => {
            if (!novel) {
                index_1.consoleDebug.warn((0, util_2.printIndexLabel)(index + 1, length), id, `不存在或沒有權限`);
                cacheTask001[id] || (cacheTask001[id] = Date.now());
                return;
            }
            index_1.consoleDebug.info((0, util_2.printIndexLabel)(index + 1, length), id, novel.title, (0, moment_1.moment)(novel.updated)
                .format(), novel.last_update_name);
            cacheTask001[id] = novel.updated;
            return (0, fs_1.outputJSONLazy)(_file, novel);
        })
            .tap(async function () {
            if (boolCache === null || boolCache === true) {
                boolCache = (0, index_2.isResponseFromAxiosCache)(this.$response);
            }
            if (boolCache !== true) {
                if ((index % 10) === 0) {
                    await _saveDataCache();
                    boolCache = null;
                }
                if ((index % 30) === 0) {
                    await saveCache();
                    boolCache = null;
                }
            }
        });
        (0, free_gc_1.freeGC)();
    });
    function _saveDataCache() {
        return bluebird_1.default.all([
            (0, fs_1.outputJSONLazy)(file_task001, cacheTask001)
                .then(e => {
                index_1.consoleDebug.info(`outputJSON`, (0, path_1.relative)(util_1.__root, file_task001));
                return e;
            }),
        ]);
    }
    return Promise.all([
        _saveDataCache(),
        saveCache(),
    ]);
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=get-novel-all.js.map