"use strict";
/**
 * Created by user on 2020/1/19.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = (0, index_1.lazyRun)(async () => {
    await (0, index_1.lazyImport)('./dz', require).catch(e => null);
    //await lazyImport('@node-novel/cached-masiro/script/build/task_logined', require).catch(e => null);
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=index.js.map