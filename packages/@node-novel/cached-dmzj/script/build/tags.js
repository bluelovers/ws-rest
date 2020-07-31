"use strict";
/**
 * Created by user on 2019/7/28.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const bluebird_1 = __importDefault(require("bluebird"));
const bluebird_2 = __importDefault(require("@bluelovers/fast-glob/bluebird"));
const array_hyper_unique_1 = require("array-hyper-unique");
const util_2 = require("dmzj-api/lib/util");
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const util_3 = require("@novel-segment/util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
let _cache_map = {};
exports.default = index_1.lazyRun(async () => {
    const { api, saveCache } = await util_1.getDmzjClient();
    let ids = [];
    let tags = [];
    let authors = [];
    let zone = [];
    let titles = [];
    let id_titles = {};
    let id_authors = {};
    let info_pack = {};
    await bluebird_2.default.async([
        '*.json',
    ], {
        cwd: path_1.default.join(util_1.__root, 'data', 'novel/info'),
        absolute: true,
    })
        .each(async (file) => {
        let v = await fs_extra_1.default.readJSON(file);
        info_pack[v.id] = v;
        ids.push(v.id);
        tags.push(...util_2.fixDmzjNovelTags(v.types));
        authors.push(util_2.trimUnsafe(v.authors));
        zone.push(util_2.trimUnsafe(v.zone));
        titles.push(util_2.trimUnsafe(v.name));
        id_titles[v.id] = util_2.trimUnsafe(v.name);
        id_authors[util_2.trimUnsafe(v.authors)] = id_authors[util_2.trimUnsafe(v.authors)] || {};
        id_authors[util_2.trimUnsafe(v.authors)][v.id] = util_2.trimUnsafe(v.name);
    });
    tags = array_hyper_unique_1.array_unique_overwrite(tags).sort(_sortFn001);
    authors = array_hyper_unique_1.array_unique_overwrite(authors).sort(_sortFn001);
    zone = array_hyper_unique_1.array_unique_overwrite(zone).sort(_sortFn001);
    titles = array_hyper_unique_1.array_unique_overwrite(titles).sort(_sortFn001);
    ids = ids.sort((a, b) => a - b);
    id_authors = sort_object_keys2_1.default(id_authors, {
        sort: _sortFn001,
    });
    await bluebird_1.default.all([
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `tags.json`), tags, {
            spaces: 2,
        }),
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `zone.json`), zone, {
            spaces: 2,
        }),
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `authors.json`), authors, {
            spaces: 2,
        }),
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `titles.json`), titles, {
            spaces: 2,
        }),
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `id_titles.json`), id_titles, {
            spaces: 2,
        }),
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `id_authors.json`), id_authors, {
            spaces: 2,
        }),
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `ids.json`), ids, {
            spaces: 2,
        }),
        fs_extra_1.default.outputJSON(path_1.default.join(util_1.__root, 'data', 'novel', `info.pack.json`), info_pack),
    ]);
}, {
    pkgLabel: __filename
});
function _sortFn001(a, b) {
    var _a, _b;
    let aa = (_a = _cache_map[a]) !== null && _a !== void 0 ? _a : (_cache_map[a] = util_3.getCjkName(a));
    let bb = (_b = _cache_map[b]) !== null && _b !== void 0 ? _b : (_cache_map[b] = util_3.getCjkName(b));
    return util_3.zhDictCompare(aa, bb);
}
//# sourceMappingURL=tags.js.map