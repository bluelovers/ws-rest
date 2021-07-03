"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const main_1 = require("./util/main");
const util_1 = require("./util");
const bluebird_cancellation_1 = (0, tslib_1.__importDefault)(require("bluebird-cancellation"));
exports.default = (0, index_1.lazyRun)(async () => {
    let bool = await bluebird_cancellation_1.default.resolve((0, util_1.getApiClient)())
        .catch(e => {
        util_1.console.red.dir(e);
        util_1.console.red(`伺服器可能發生錯誤，無法連線`);
        return null;
    });
    if (bool == null) {
        return;
    }
    await (0, index_1.lazyImport)('./build/toplist', require);
    await (0, index_1.lazyImport)('./build/task001', require);
    await (0, index_1.lazyImport)('./build/merge', require);
    await (0, index_1.lazyImport)('./build/merge002', require);
    await (0, index_1.lazyImport)('./build/cache', require);
    await (0, index_1.lazyImport)('./build/task_logined', require);
}, {
    pkgLabel: main_1.pkgLabel,
});
//# sourceMappingURL=build.js.map