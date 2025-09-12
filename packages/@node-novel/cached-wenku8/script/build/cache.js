"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const files_1 = tslib_1.__importStar(require("../util/files"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("@novel-segment/util");
const sort_object_keys2_1 = tslib_1.__importDefault(require("sort-object-keys2"));
const array_hyper_unique_1 = require("array-hyper-unique");
const index_1 = require("@node-novel/site-cache-util/lib/index");
let _cache_map = {};
exports.default = (0, index_1.lazyRun)(async () => {
    let recentUpdate = await (0, fs_extra_1.readJSON)(files_1.default.recentUpdate);
    let idAuthors = {};
    let idUpdate = [];
    let ids = [];
    let titles = [];
    let authors = [];
    let idTitles = {};
    let copyrightRemove = {};
    let id_chapters = {};
    let idVolumes = {};
    await bluebird_1.default
        .resolve(recentUpdate.data)
        .each(async (row) => {
        let { id, name } = row;
        idAuthors[row.authors] = idAuthors[row.authors] || {};
        idAuthors[row.authors][id] = name;
        ids.push(id);
        titles.push(name);
        authors.push(row.authors);
        idTitles[id] = name;
        let _file = (0, files_1.cacheFileInfoPath)(id);
        idVolumes[id] = 0;
        let info = await (0, fs_extra_1.readJSON)(_file).catch(e => null);
        if (info) {
            if (info.copyright_remove) {
                copyrightRemove[id] = name;
            }
            id_chapters[id] = info.chapters.reduce((len, vol) => {
                idVolumes[id]++;
                return len += vol.chapters.length;
            }, 0);
        }
    })
        .then(data => data.sort((a, b) => {
        return b.last_update_time - a.last_update_time;
    }))
        .each(row => {
        let { id, name, authors } = row;
        idUpdate.push(id);
    });
    idAuthors = (0, sort_object_keys2_1.default)(idAuthors, {
        sort: _sortFn001,
    });
    titles = (0, array_hyper_unique_1.array_unique_overwrite)(titles).sort(_sortFn001);
    authors = (0, array_hyper_unique_1.array_unique_overwrite)(authors).sort(_sortFn001);
    await bluebird_1.default.all([
        (0, fs_extra_1.writeJSON)(files_1.default.idAuthors, idAuthors, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.idUpdate, idUpdate, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.idTitles, idTitles, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.ids, ids, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.titles, titles, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.authors, authors, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.copyrightRemove, copyrightRemove, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.idChapters, id_chapters, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.idVolumes, idVolumes, {
            spaces: 2,
        }),
    ]);
}, {
    pkgLabel: __filename
});
function _sortFn001(a, b) {
    var _a, _b;
    let aa = (_a = _cache_map[a]) !== null && _a !== void 0 ? _a : (_cache_map[a] = (0, util_1.getCjkName)(a));
    let bb = (_b = _cache_map[b]) !== null && _b !== void 0 ? _b : (_cache_map[b] = (0, util_1.getCjkName)(b));
    return (0, util_1.zhDictCompare)(aa, bb);
}
//# sourceMappingURL=cache.js.map