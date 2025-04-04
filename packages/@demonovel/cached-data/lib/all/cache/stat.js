"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCachedStat = buildCachedStat;
const path_1 = require("path");
const __root_1 = require("../../__root");
const fs_1 = require("../../util/fs");
function buildCachedStat(list) {
    let total = list.length;
    let firstEntry = list[0];
    let updated = firstEntry.updated;
    let out = {
        timestamp: Date.now(),
        total,
        updated,
    };
    return (0, fs_1.outputJSONWithIndent)((0, path_1.join)(__root_1.__rootCache, `stat.json`), out);
}
exports.default = buildCachedStat;
//# sourceMappingURL=stat.js.map