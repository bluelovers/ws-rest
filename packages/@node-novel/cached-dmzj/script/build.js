"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by user on 2019/7/28.
 */
const index_1 = require("@node-novel/site-cache-util/lib/index");
const main_1 = require("./util/main");
exports.default = index_1.lazyRun(async () => {
    await index_1.lazyImport('./build/dmzj', require);
    await index_1.lazyImport('./build/info', require);
    await index_1.lazyImport('./build/tags', require);
    await index_1.lazyImport('./build/info2', require);
}, {
    pkgLabel: main_1.pkgLabel,
});
//# sourceMappingURL=build.js.map