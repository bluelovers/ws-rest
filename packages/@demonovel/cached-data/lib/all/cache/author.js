"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCachedAuthors = void 0;
const tslib_1 = require("tslib");
const slugify_1 = (0, tslib_1.__importStar)(require("../../util/slugify"));
const util_1 = require("../util");
const array_hyper_unique_1 = require("array-hyper-unique");
const util_2 = require("@novel-segment/util");
const path_1 = require("path");
const __root_1 = require("../../__root");
const fs_1 = require("../../util/fs");
function buildCachedAuthors(list) {
    let authors = {};
    list
        .forEach(item => {
        item = {
            ...item,
        };
        if (!item.authors || !item.authors.length) {
            item.authors = [''];
        }
        let author = item.authors[0];
        if (author == null) {
            author = '';
        }
        author = (0, slugify_1.slugifyNovel2)(author);
        let list = [
            author
        ];
        item.authors
            .forEach(title => {
            title = (0, slugify_1.default)(title);
            list.push(title);
            (0, util_1.doTitle)(title, list);
        });
        (0, array_hyper_unique_1.array_unique_overwrite)(list);
        let first;
        for (let author of list) {
            if (author in authors) {
                first = authors[author];
                break;
            }
        }
        if (!first) {
            first = authors[author] || [];
        }
        list.forEach(author => {
            if ((author in authors) && authors[author] !== first) {
                first.push(...authors[author]);
            }
            authors[author] = first;
        });
        first.push(item.uuid);
    });
    Object.values(authors)
        .forEach(v => (0, array_hyper_unique_1.array_unique_overwrite)(v).sort());
    let out = Object.entries(authors);
    out = out.sort((a, b) => {
        return (0, util_2.zhDictCompare)(a[0], b[0]);
    });
    return (0, fs_1.outputJSONWithIndent)((0, path_1.join)(__root_1.__rootCache, 'preset', `authors.json`), out);
}
exports.buildCachedAuthors = buildCachedAuthors;
exports.default = buildCachedAuthors;
//# sourceMappingURL=author.js.map