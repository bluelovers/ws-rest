"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const util_1 = require("../util");
const files_1 = require("../util/files");
const fs_extra_1 = require("fs-extra");
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const path_1 = require("path");
const bluebird_1 = (0, tslib_1.__importDefault)(require("@bluelovers/fast-glob/bluebird"));
const array_hyper_unique_1 = require("array-hyper-unique");
const util_2 = require("@novel-segment/util");
const sort_object_keys2_1 = (0, tslib_1.__importDefault)(require("sort-object-keys2"));
let _cache_map = {};
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    const file_recentUpdate = files_1.cacheFilePaths.recentUpdate;
    let recentUpdateList = await (0, fs_extra_1.readJSON)(file_recentUpdate);
    let _cacheMap = {
        idAuthors: {},
        idUpdate: {},
        ids: [],
        titles: [],
        authors: [],
        tags: [],
        idTitles: {},
        idChapters: {},
        idVolumes: {},
    };
    await bluebird_1.default.async([
        '*.json',
    ], {
        cwd: (0, path_1.dirname)((0, files_1.cacheFileInfoPath)(1)),
        absolute: true,
    })
        .mapSeries(async (_file, index, length) => {
        var _a, _b, _c, _d, _e, _f;
        var _g;
        const novel = await (0, fs_extra_1.readJSON)(_file);
        const { id, title } = novel;
        if (!title) {
            console.warn(`${id} 不存在或者已刪除`, novel);
            return;
        }
        ((_a = novel.authors) === null || _a === void 0 ? void 0 : _a.length) && _cacheMap.authors.push(...novel.authors);
        _cacheMap.ids.push(novel.id);
        ((_b = novel.tags) === null || _b === void 0 ? void 0 : _b.length) && _cacheMap.tags.push(...novel.tags);
        _cacheMap.titles.push(title);
        let author = (_d = (_c = novel.authors) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : '';
        _cacheMap.idTitles[id] = title;
        if (typeof author === 'string') {
            (_e = (_g = _cacheMap.idAuthors)[author]) !== null && _e !== void 0 ? _e : (_g[author] = {});
            _cacheMap.idAuthors[author][id] = title;
        }
        _cacheMap.idVolumes[id] = 0;
        _cacheMap.idChapters[id] = 0;
        if ((_f = novel.chapters) === null || _f === void 0 ? void 0 : _f.length) {
            _cacheMap.idChapters[id] = novel.chapters.reduce((len, vol) => {
                _cacheMap.idVolumes[id]++;
                return len + vol.chapters.length;
            }, 0);
        }
        _cacheMap.idUpdate[id] = novel.updated;
        return novel;
    });
    _cacheMap.idAuthors = (0, sort_object_keys2_1.default)(_cacheMap.idAuthors, {
        sort: _sortFn001,
    });
    [
        'authors',
        'ids',
        'tags',
        'titles',
    ].forEach(key => {
        (0, array_hyper_unique_1.array_unique_overwrite)(_cacheMap[key]).sort(_sortFn001);
    });
    return Promise.all([
        ...Object.keys(_cacheMap)
            .map((key) => {
            var _a;
            if (!((_a = files_1.cacheFilePaths[key]) === null || _a === void 0 ? void 0 : _a.length)) {
                throw new Error(`${key} not exists in cacheFilePaths`);
            }
            return (0, fs_1.outputJSONLazy)(files_1.cacheFilePaths[key], _cacheMap[key]);
        }),
        saveCache(),
    ]);
}, {
    pkgLabel: __filename,
});
function _sortFn001(a, b) {
    var _a, _b;
    let aa = (_a = _cache_map[a]) !== null && _a !== void 0 ? _a : (_cache_map[a] = (0, util_2.getCjkName)(a));
    let bb = (_b = _cache_map[b]) !== null && _b !== void 0 ? _b : (_cache_map[b] = (0, util_2.getCjkName)(b));
    return (0, util_2.zhDictCompare)(aa, bb);
}
//# sourceMappingURL=build-cache.js.map