"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const cache_loader_1 = require("@node-novel/cache-loader");
const bluebird_1 = __importDefault(require("bluebird"));
const types_1 = require("./types");
const class_1 = __importDefault(require("node-novel-info/class"));
const lib_1 = __importDefault(require("dot-values2/lib"));
const util_1 = require("../util");
const moment_1 = require("../util/moment");
function build(source) {
    return bluebird_1.default
        .resolve(source)
        .then(table => cache_loader_1.createFromJSON(table))
        .then(async (nc) => {
        let novels = nc.filterNovel();
        let list = lib_1.default.get(novels, `*.*`);
        return list
            .map(novel => {
            let id = novel.pathMain_base + '/' + novel.novelID;
            //console.log(siteID, id);
            let info = class_1.default.create(novel.mdconf);
            let novelID = novel.novelID;
            let uuid = util_1.newUUID(types_1.siteID, id);
            let pathMain = novel.pathMain_base;
            let title = info.title();
            let content = lib_1.default.get(novel, 'mdconf.novel.preface');
            if (content) {
                content = util_1.trim(content);
            }
            else {
                content = void 0;
            }
            let updated = novel.cache.epub_date || 0;
            if (updated) {
                updated = moment_1.createMomentByMilliseconds(updated).valueOf();
            }
            let item = {
                siteID: types_1.siteID,
                pathMain,
                novelID,
                uuid,
                id,
                title,
                titles: info.titles(),
                cover: lib_1.default.get(novel, 'mdconf.novel.cover'),
                authors: info.authors(),
                updated,
                //chapters_num,
                //last_update_name,
                tags: info.tags(),
                content,
                epub_basename: novel.cache.epub_basename,
                pathMain_real: novel.pathMain,
                illusts: info.illusts(),
                publishers: info.publishers(),
                status: info.status(),
            };
            return item;
        })
            .filter(Boolean)
            .sort((a, b) => {
            let i = (b.updated - a.updated);
            if (b.updated > a.updated) {
                return 1;
            }
            else if (b.updated < a.updated) {
                return -1;
            }
            return 0;
        })
            .reduce((a, item) => {
            a[item.uuid] = item;
            return a;
        }, {});
    });
}
exports.build = build;
exports.default = build;
//# sourceMappingURL=build.js.map