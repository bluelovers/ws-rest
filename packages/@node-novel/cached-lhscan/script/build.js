"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by user on 2019/7/7.
 */
const index_1 = require("@node-novel/site-cache-util/lib/index");
const main_1 = require("./util/main");
exports.default = index_1.lazyRun(async () => {
    await index_1.lazyImport('./build/manga-list', require);
    await index_1.lazyImport('./build/manga-detail', require);
}, {
    pkgLabel: main_1.pkgLabel,
});
//# sourceMappingURL=build.js.map