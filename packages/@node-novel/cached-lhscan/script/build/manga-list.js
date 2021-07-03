"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const util_1 = require("../util");
const files_1 = (0, tslib_1.__importDefault)(require("../util/files"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const file = (0, upath2_1.join)(files_1.default.dirDataRoot, 'list-cache.json');
const file1 = (0, upath2_1.join)(files_1.default.dirTempRoot, 'process-cache.json');
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    let listCache = await (0, fs_extra_1.readJSON)(file)
        .catch(e => ({}));
    let processCache = await (0, fs_extra_1.readJSON)(file1)
        .catch(e => ({}));
    index_1.console.dir(processCache);
    let page = processCache.last_page;
    let page_max = processCache.last_page_max;
    let ret = await api.mangaList({
        page: 1,
    });
    await _handleMangaList(ret);
    if (ret.page_max != page_max) {
        let max = Math.max(ret.page_max || page_max, 1);
        let diff = Math.abs(max - page_max);
        page_max = max;
        if (!page) {
            page = ret.page_max;
        }
        else {
            page = Math.max(page, page + diff);
        }
        page = Math.max(Math.min(page, page_max), 1);
        ret = await api.mangaList({
            page,
        });
        await _handleMangaList(ret);
    }
    else {
        page_max = Math.max(ret.page_max || page_max, 1);
        page !== null && page !== void 0 ? page : (page = page_max);
    }
    page = Math.max(Math.min(page, page_max), 1);
    processCache.last_page = page;
    processCache.last_page_max = page_max;
    index_1.console.dir(processCache);
    await Promise.all([
        (0, fs_1.outputJSONLazy)(file, listCache),
        (0, fs_1.outputJSONLazy)(file1, processCache),
        saveCache(),
    ]);
    while (page > 1) {
        try {
            ret = await api.mangaList({
                page,
            });
            await _handleMangaList(ret);
            processCache.last_page = page;
            await Promise.all([
                (0, fs_1.outputJSONLazy)(file, listCache),
                (0, fs_1.outputJSONLazy)(file1, processCache),
                saveCache(),
            ]);
            page = Math.max(1, --page);
        }
        catch (e) {
            break;
        }
    }
    index_1.console.dir(processCache);
    await _saveDataCache();
    await saveCache();
    function _handleMangaList(ret) {
        index_1.console.log(ret.page, '/', ret.page_max, ret.list.length);
        return bluebird_1.default.resolve(ret.list)
            .each(async (row) => {
            var _a, _b, _c;
            const id = row.id;
            if (!((_a = row.id_key) === null || _a === void 0 ? void 0 : _a.length)) {
                index_1.consoleDebug.red.log(`[error]`, ret.page, '/', ret.page_max, id, row.title);
                return;
            }
            let old = listCache[id];
            let bool;
            let last_update = old === null || old === void 0 ? void 0 : old.last_update;
            if (typeof old === 'undefined') {
                bool = true;
            }
            else if (((_b = row.last_chapter) === null || _b === void 0 ? void 0 : _b.chapter_id) !== ((_c = old === null || old === void 0 ? void 0 : old.last_chapter) === null || _c === void 0 ? void 0 : _c.chapter_id)) {
                bool = true;
            }
            else if (last_update !== row.last_update) {
                bool = true;
            }
            if (bool) {
                await api.mangaMetaPop(row.id)
                    .then(meta => {
                    row.last_update = meta.last_update;
                    row.other_names = meta.other_names;
                });
            }
            listCache[id] = row;
        });
    }
    function _saveDataCache() {
        return bluebird_1.default.all([
            (0, fs_1.outputJSONLazy)(file, listCache)
                .then(e => {
                index_1.consoleDebug.info(`outputJSON`, (0, upath2_1.relative)(util_1.__root, file));
                return e;
            }),
            (0, fs_1.outputJSONLazy)(file1, processCache)
                .then(e => {
                index_1.consoleDebug.info(`outputJSON`, (0, upath2_1.relative)(util_1.__root, file1));
                return e;
            }),
        ]);
    }
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=manga-list.js.map