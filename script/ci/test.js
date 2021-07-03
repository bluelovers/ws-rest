"use strict";
/**
 * Created by user on 2020/1/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = (0, index_1.lazyRun)(async () => {
    await (0, index_1.lazyImport)('./test/chk-moment', require);
    await (0, index_1.lazyImport)('./test/chk-cache', require);
    await (0, index_1.lazyImport)('./test/try-cache', require);
    await (0, index_1.lazyImport)('./test/chk-env', require);
    await (0, index_1.lazyImport)('./test/info-ci', require);
}, {
    pkgLabel: __filename,
})
    .tapCatch(e => {
    index_1.console.exception(e);
    process.exit(1);
});
//# sourceMappingURL=test.js.map