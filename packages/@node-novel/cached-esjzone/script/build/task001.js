"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("../util");
const fs_extra_1 = (0, tslib_1.__importStar)(require("fs-extra"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const upath2_1 = (0, tslib_1.__importDefault)(require("upath2"));
const files_1 = (0, tslib_1.__importStar)(require("../util/files"));
const lib_1 = require("@bluelovers/axios-util/lib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const file = files_1.default.recentUpdate;
const file1 = files_1.default.task001;
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    api.cookiesRemoveTrack();
    let listCache = await (0, fs_extra_1.readJSON)(file1)
        .catch(e => ({}));
    let novelList = await fs_extra_1.default.readJSON(file);
    let index = 1;
    let boolCache;
    await bluebird_1.default
        .resolve(novelList.data)
        .mapSeries(async (row) => {
        let { id, last_update_time } = row;
        if (listCache[id] == null) {
            let _file = (0, files_1.cacheFileInfoPath)(id);
            return api.bookInfo(id)
                .tap(async (data) => {
                let old = await (0, fs_extra_1.readJSON)(_file).catch(e => null);
                if (!data.last_update_time && data.name === '' && (old === null || old === void 0 ? void 0 : old.name)) {
                    // 保留被刪除的書籍資料
                    data = old;
                }
                if (data.last_update_time < row.last_update_time) {
                    util_1.consoleDebug.error(index, id, row.name, moment_1.moment.unix(listCache[id]).format(), data.last_update_chapter_name);
                    return;
                }
                listCache[id] = Math.max(data.last_update_time | 0, last_update_time | 0, 0);
                if (!data.last_update_time && listCache[id]) {
                    data.last_update_time = listCache[id];
                }
                util_1.consoleDebug.info(index, id, row.name, moment_1.moment.unix(listCache[id]).format(), data.last_update_chapter_name);
                index++;
                return bluebird_1.default.all([
                    fs_extra_1.default.outputJSON(_file, data, {
                        spaces: 2,
                    }),
                ]);
            })
                .tap(async function (r) {
                if (boolCache != false) {
                    // @ts-ignore
                    boolCache = (0, lib_1.isResponseFromAxiosCache)(this.$response);
                }
                if (!boolCache) {
                    if ((index % 10) == 0) {
                        await _saveDataCache();
                        boolCache = null;
                    }
                    if ((index % 100) == 0) {
                        await saveCache();
                        boolCache = null;
                    }
                }
            });
        }
        else {
            //consoleDebug.gray.debug(`[SKIP]`, index, id, row.name, moment.unix(listCache[id]).format());
        }
    })
        .catch(e => util_1.console.error(e));
    await _saveDataCache();
    await saveCache();
    function _saveDataCache() {
        return bluebird_1.default.all([
            fs_extra_1.default.outputJSON(file1, listCache, {
                spaces: 2,
            })
                .then(e => {
                util_1.consoleDebug.info(`outputJSON`, upath2_1.default.relative(util_1.__root, file1));
                return e;
            }),
        ]);
    }
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=task001.js.map