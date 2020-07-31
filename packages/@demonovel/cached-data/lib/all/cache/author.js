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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCachedAuthors = void 0;
const slugify_1 = __importStar(require("../../util/slugify"));
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
        author = slugify_1.slugifyNovel2(author);
        let list = [
            author
        ];
        item.authors
            .forEach(title => {
            title = slugify_1.default(title);
            list.push(title);
            util_1.doTitle(title, list);
        });
        array_hyper_unique_1.array_unique_overwrite(list);
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
        .forEach(v => array_hyper_unique_1.array_unique_overwrite(v).sort());
    let out = Object.entries(authors);
    out = out.sort((a, b) => {
        return util_2.zhDictCompare(a[0], b[0]);
    });
    return fs_1.outputJSONWithIndent(path_1.join(__root_1.__rootCache, 'preset', `authors.json`), out);
}
exports.buildCachedAuthors = buildCachedAuthors;
exports.default = buildCachedAuthors;
//# sourceMappingURL=author.js.map