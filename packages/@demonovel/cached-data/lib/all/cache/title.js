"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCachedTitle = void 0;
const tslib_1 = require("tslib");
const slugify_1 = tslib_1.__importDefault(require("../../util/slugify"));
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
        let title = (0, slugify_1.default)(item.title);
        let list = [];
        list.push(title);
        (0, util_1.doTitle)(title, list);
        if (item.titles) {
            item.titles
                .forEach(title => {
                title = (0, slugify_1.default)(title);
                list.push(title);
                (0, util_1.doTitle)(title, list);
            });
        }
        (0, array_hyper_unique_1.array_unique_overwrite)(list);
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
        .forEach(v => (0, array_hyper_unique_1.array_unique_overwrite)(v).sort());
    let out = Object.entries(titles);
    out = out.sort((a, b) => {
        return (0, util_2.zhDictCompare)(a[0], b[0]);
    });
    return (0, fs_1.outputJSONWithIndent)((0, path_1.join)(__root_1.__rootCache, 'preset', `titles.json`), out);
}
exports.buildCachedTitle = buildCachedTitle;
exports.default = buildCachedTitle;
//# sourceMappingURL=title.js.map