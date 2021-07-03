"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const project_root_1 = require("../../project-root");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
exports.default = (0, index_1.lazyRun)(async () => {
    let __root = project_root_1.__rootWs;
    await fs_extra_1.default.ensureFile(index_1.path.join(__root, 'packages/@node-novel', 'cached-dmzj', 'test/temp', 'cache.ensure.txt'));
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=try-cache.js.map