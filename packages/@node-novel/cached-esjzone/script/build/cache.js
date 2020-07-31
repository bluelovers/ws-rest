"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const files_1 = __importDefault(require("../util/files"));
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("@novel-segment/util");
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const array_hyper_unique_1 = require("array-hyper-unique");
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const index_1 = require("@node-novel/site-cache-util/lib/index");
let _cache_map = {};
exports.default = index_1.lazyRun(async () => {
    let infoPack = await fs_extra_1.readJSON(files_1.default.infoPack);
    let idAuthors = {};
    let idUpdate = [];
    let ids = [];
    let titles = [];
    let authors = [];
    let tags = [];
    let idTitles = {};
    let id_chapters = {};
    let idVolumes = {};
    await bluebird_1.default
        .resolve(Object.values(infoPack))
        .each(async (row) => {
        var _a;
        let { id, name, authors: rowAuthors } = row;
        rowAuthors = String(rowAuthors);
        idAuthors[rowAuthors] = idAuthors[rowAuthors] || {};
        idAuthors[rowAuthors][id] = name;
        ids.push(id);
        titles.push(name);
        if (((_a = row.titles) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            titles.push(...row.titles);
        }
        authors.push(rowAuthors);
        idTitles[id] = name;
        tags.push(...row.tags);
        idVolumes[id] = 0;
        id_chapters[id] = row.chapters.reduce((len, vol) => {
            idVolumes[id]++;
            return len += vol.chapters.length;
        }, 0);
    })
        .then(data => data.sort((a, b) => {
        return b.last_update_time - a.last_update_time;
    }))
        .each(row => {
        let { id, name, authors } = row;
        idUpdate.push(id);
    });
    idAuthors = sort_object_keys2_1.default(idAuthors, {
        sort: _sortFn001,
    });
    titles = array_hyper_unique_1.array_unique_overwrite(titles).sort(_sortFn001);
    authors = array_hyper_unique_1.array_unique_overwrite(authors).sort(_sortFn001);
    tags = array_hyper_unique_1.array_unique_overwrite(tags).sort(_sortFn001);
    await bluebird_1.default.all([
        fs_1.outputJSONLazy(files_1.default.idAuthors, idAuthors),
        fs_1.outputJSONLazy(files_1.default.idUpdate, idUpdate),
        fs_1.outputJSONLazy(files_1.default.idTitles, idTitles),
        fs_1.outputJSONLazy(files_1.default.ids, ids),
        fs_1.outputJSONLazy(files_1.default.titles, titles),
        fs_1.outputJSONLazy(files_1.default.authors, authors),
        fs_1.outputJSONLazy(files_1.default.idChapters, id_chapters),
        fs_1.outputJSONLazy(files_1.default.tags, tags),
        fs_1.outputJSONLazy(files_1.default.idVolumes, idVolumes),
    ]);
}, {
    pkgLabel: __filename
});
function _sortFn001(a, b) {
    var _a, _b;
    let aa = (_a = _cache_map[a]) !== null && _a !== void 0 ? _a : (_cache_map[a] = util_1.getCjkName(a));
    let bb = (_b = _cache_map[b]) !== null && _b !== void 0 ? _b : (_cache_map[b] = util_1.getCjkName(b));
    return util_1.zhDictCompare(aa, bb);
}
//# sourceMappingURL=cache.js.map