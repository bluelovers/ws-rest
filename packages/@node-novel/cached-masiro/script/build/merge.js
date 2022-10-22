"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const files_1 = tslib_1.__importDefault(require("../util/files"));
const bluebird_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob/bluebird"));
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = (0, index_1.lazyRun)(async () => {
    let data = await bluebird_1.default
        .async([
        '*.json',
    ], {
        cwd: files_1.default.dirFid,
        absolute: true,
    })
        .reduce(async (a, file) => {
        let info = await (0, fs_extra_1.readJSON)(file);
        a[info.fid] = info;
        return a;
    }, {});
    await (0, fs_extra_1.writeJSON)(files_1.default.infoPack, data);
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=merge.js.map