"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const files_1 = __importDefault(require("../util/files"));
const util_1 = require("../util");
const bluebird_1 = __importDefault(require("@bluelovers/fast-glob/bluebird"));
const upath2_1 = __importDefault(require("upath2"));
const util_2 = require("@novel-segment/util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
let _cache_map = {};
exports.default = index_1.lazyRun(async () => {
    let data = await bluebird_1.default
        .async([
        '*.json',
    ], {
        cwd: upath2_1.default.join(util_1.__root, 'data', 'novel/info'),
        absolute: true,
    })
        .reduce(async (a, file) => {
        let info = await fs_extra_1.readJSON(file);
        a[info.id] = info;
        return a;
    }, {});
    await fs_extra_1.writeJSON(files_1.default.infoPack, data);
}, {
    pkgLabel: __filename
});
function _sortFn001(a, b) {
    let aa = _cache_map[a] || (_cache_map[a] = util_2.getCjkName(a));
    let bb = _cache_map[b] || (_cache_map[b] = util_2.getCjkName(b));
    return util_2.zhDictCompare(aa, bb);
}
//# sourceMappingURL=merge.js.map