"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const util_1 = require("../util");
const files_1 = (0, tslib_1.__importStar)(require("../util/files"));
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const file_task001 = files_1.default.task001;
const file = (0, upath2_1.join)(files_1.default.dirDataRoot, 'list-cache.json');
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    let taskCache = await (0, fs_extra_1.readJSON)(file_task001)
        .catch(e => ({}));
    let listCache = await (0, fs_extra_1.readJSON)(file)
        .catch(e => ({}));
    let changed;
    let idx = 0;
    let list = Object.values(listCache);
    await bluebird_1.default.resolve(list)
        .mapSeries(async (row, index) => {
        let { id, id_key, last_update } = row;
        if (!(id_key === null || id_key === void 0 ? void 0 : id_key.length)) {
            index_1.consoleDebug.red.log(`[error]`, index, '/', list.length, id, id_key, row.title);
            return;
        }
        let _file = (0, files_1.cacheFileInfoPath)(id);
        index_1.consoleDebug.log(index, '/', list.length, id, id_key, row.title);
        let data = {
            id,
            id_key,
        };
        let old = await (0, fs_extra_1.readJSON)(_file).catch(err => void 0);
        if (last_update !== taskCache[id] || taskCache[id] === null || last_update !== (old === null || old === void 0 ? void 0 : old.last_update)) {
            index_1.console.grey.log(index, '/', list.length, id, id_key, row.title);
            index_1.consoleDebug.debug(`[update]`, id, row.title, [last_update, taskCache[id], old === null || old === void 0 ? void 0 : old.last_update]);
            data = await bluebird_1.default.props({
                ret: api.manga(id_key),
                meta: api.mangaMetaPop(row.id),
            })
                .then((result) => {
                let { last_update } = result.meta;
                return {
                    ...data,
                    ...result.ret,
                    id,
                    last_update,
                };
            });
            if (data.last_update > last_update) {
                row.last_update = data.last_update;
                row.last_chapter = data.last_chapter;
                changed = true;
            }
            taskCache[id] = row.last_update;
            await (0, fs_1.outputJSONLazy)(_file, data);
            if ((++idx % 10) === 0) {
                await _saveDataCache();
            }
        }
        else {
            index_1.console.grey.log(index, '/', list.length, id, id_key, row.title);
        }
    });
    await _saveDataCache();
    await saveCache();
    function _saveDataCache() {
        return bluebird_1.default.all([
            changed && (0, fs_1.outputJSONLazy)(file, listCache)
                .then(e => {
                index_1.consoleDebug.info(`outputJSON`, (0, upath2_1.relative)(util_1.__root, file));
                return e;
            }),
            (0, fs_1.outputJSONLazy)(file_task001, taskCache)
                .then(e => {
                index_1.consoleDebug.info(`outputJSON`, (0, upath2_1.relative)(util_1.__root, file_task001));
                return e;
            }),
        ]);
    }
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=manga-detail.js.map