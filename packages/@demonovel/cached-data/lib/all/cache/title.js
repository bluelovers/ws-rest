"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCachedTitle = void 0;
const slugify_1 = __importDefault(require("../../util/slugify"));
const util_1 = require("../util");
const array_hyper_unique_1 = require("array-hyper-unique");
const util_2 = require("@novel-segment/util");
const path_1 = require("path");
const __root_1 = require("../../__root");
const fs_1 = require("../../util/fs");
function buildCachedTitle(list) {
    let titles = {};
    list
        .forEach(item => {
        let title = slugify_1.default(item.title);
        let list = [];
        list.push(title);
        util_1.doTitle(title, list);
        if (item.titles) {
            item.titles
                .forEach(title => {
                title = slugify_1.default(title);
                list.push(title);
                util_1.doTitle(title, list);
            });
        }
        array_hyper_unique_1.array_unique_overwrite(list);
        let first;
        for (let title of list) {
            if (title in titles) {
                first = titles[title];
                break;
            }
        }
        if (!first) {
            first = titles[title] || [];
        }
        list.forEach(title => {
            if ((title in titles) && titles[title] !== first) {
                first.push(...titles[title]);
            }
            titles[title] = first;
        });
        first.push(item.uuid);
    });
    Object.values(titles)
        .forEach(v => array_hyper_unique_1.array_unique_overwrite(v).sort());
    let out = Object.entries(titles);
    out = out.sort((a, b) => {
        return util_2.zhDictCompare(a[0], b[0]);
    });
    return fs_1.outputJSONWithIndent(path_1.join(__root_1.__rootCache, 'preset', `titles.json`), out);
}
exports.buildCachedTitle = buildCachedTitle;
exports.default = buildCachedTitle;
//# sourceMappingURL=title.js.map