"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("../util");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const upath2_1 = tslib_1.__importDefault(require("upath2"));
const files_1 = tslib_1.__importStar(require("../util/files"));
const index_1 = require("@node-novel/site-cache-util/lib/index");
const free_gc_1 = require("free-gc");
const file = files_1.default.recentUpdate;
const file1 = files_1.default.task001;
const file_copyright_remove = files_1.default.copyrightRemove;
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    api.cookiesRemoveTrack();
    let listCache = await (0, fs_extra_1.readJSON)(file1)
        .catch(e => ({}));
    let novelList = await (0, fs_extra_1.readJSON)(file);
    let _cache = {};
    _cache.copyright_remove = await (0, fs_extra_1.readJSON)(file_copyright_remove).catch(e => { }) || {};
    let index = 1;
    await bluebird_1.default
        .resolve(novelList.data)
        .mapSeries(async (row) => {
        let { id, last_update_time } = row;
        if (listCache[id] != last_update_time || listCache[id] == null) {
            let _file = (0, files_1.cacheFileInfoPath)(id);
            if (_cache.copyright_remove[id] && listCache[id] != null && (0, fs_extra_1.pathExistsSync)(_file)) {
                util_1.consoleDebug.info(`[SKIP]`, index, id, row.name, moment_1.moment.unix(last_update_time).format());
            }
            (0, free_gc_1.freeGC)();
            return api.bookInfoWithChapters(id)
                .tap(async (data) => {
                util_1.consoleDebug.debug(index, id, row.name, moment_1.moment.unix(last_update_time).format(), row.last_update_chapter_name);
                index++;
                listCache[id] = Math.max(data.last_update_time, last_update_time, 0);
                if (data.copyright_remove) {
                    _cache.copyright_remove[id] = data.name;
                    util_1.consoleDebug.red.info(`[copyright remove]`, id, row.name);
                }
                if (!data.last_update_time && listCache[id]) {
                    data.last_update_time = listCache[id];
                }
                return bluebird_1.default.all([
                    (0, fs_extra_1.outputJSON)(_file, data, {
                        spaces: 2,
                    }),
                ]);
            })
                .tap(async (r) => {
                if ((index % 10) == 0) {
                    await _saveDataCache();
                    api.cookiesRemoveTrack();
                }
                if ((index % 100) == 0) {
                    await saveCache();
                }
            });
        }
    })
        .catch(e => util_1.console.error(e));
    await _saveDataCache();
    await saveCache();
    function _saveDataCache() {
        return bluebird_1.default.all([
            (0, fs_extra_1.outputJSON)(file1, listCache, {
                spaces: 2,
            })
                .then(e => {
                util_1.consoleDebug.info(`outputJSON`, upath2_1.default.relative(util_1.__root, file1));
                return e;
            }),
            (0, fs_extra_1.outputJSON)(file_copyright_remove, _cache.copyright_remove, {
                spaces: 2,
            })
                .then(e => {
                util_1.consoleDebug.info(`outputJSON`, upath2_1.default.relative(util_1.__root, file_copyright_remove));
                return e;
            })
        ]);
    }
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=task001.js.map