"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const files_1 = __importStar(require("../util/files"));
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("@novel-segment/util");
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const array_hyper_unique_1 = require("array-hyper-unique");
const index_1 = require("@node-novel/site-cache-util/lib/index");
let _cache_map = {};
exports.default = index_1.lazyRun(async () => {
    let recentUpdate = await fs_extra_1.readJSON(files_1.default.recentUpdate);
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
        let _file = files_1.cacheFileInfoPath(id);
        let info = await fs_extra_1.readJSON(_file);
        if (info.copyright_remove) {
            copyrightRemove[id] = name;
        }
        idVolumes[id] = 0;
        id_chapters[id] = info.chapters.reduce((len, vol) => {
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
    await bluebird_1.default.all([
        fs_extra_1.writeJSON(files_1.default.idAuthors, idAuthors, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.idUpdate, idUpdate, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.idTitles, idTitles, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.ids, ids, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.titles, titles, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.authors, authors, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.copyrightRemove, copyrightRemove, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.idChapters, id_chapters, {
            spaces: 2,
        }),
        fs_extra_1.writeJSON(files_1.default.idVolumes, idVolumes, {
            spaces: 2,
        }),
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