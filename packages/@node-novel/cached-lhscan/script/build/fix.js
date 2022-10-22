"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const fs_extra_1 = require("fs-extra");
const upath2_1 = require("upath2");
const files_1 = tslib_1.__importDefault(require("../util/files"));
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
exports.default = (0, index_1.lazyRun)(async () => {
    const file = (0, upath2_1.join)(files_1.default.dirDataRoot, 'list-cache.json');
    let listCache = await (0, fs_extra_1.readJSON)(file)
        .catch(e => ({}));
    Object.entries(listCache)
        .forEach(([id, data]) => {
        var _a;
        if (!((_a = data.id_key) === null || _a === void 0 ? void 0 : _a.length)) {
            index_1.console.red.log(`[delete]`, id, data.title);
            delete listCache[id];
        }
    });
    await (0, fs_1.outputJSONLazy)(file, listCache);
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=fix.js.map