"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Created by user on 2019/7/7.
 */
const index_1 = require("@node-novel/site-cache-util/lib/index");
const path_1 = require("path");
const files_1 = require("./util/files");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = (0, tslib_1.__importDefault)(require("@bluelovers/fast-glob/bluebird"));
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const _sortBookFields_1 = require("masiro-me-api/lib/util/_sortBookFields");
exports.default = (0, index_1.lazyRun)(async () => {
    await bluebird_1.default.async([
        '*.json',
    ], {
        cwd: (0, path_1.dirname)((0, files_1.cacheFileInfoPath)(1)),
        absolute: true,
    })
        .mapSeries(async (_file, index, length) => {
        const novel = await (0, fs_extra_1.readJSON)(_file);
        let keys = Object.keys(novel);
        (0, _sortBookFields_1._sortBookFields)(novel);
        if (Object.keys(novel).some((value, index) => {
            return value !== keys[index];
        })) {
            return (0, fs_1.outputJSONLazy)(_file, novel);
        }
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=build-fix.js.map