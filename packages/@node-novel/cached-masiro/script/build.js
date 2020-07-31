"use strict";
/**
 * Created by user on 2019/7/7.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@node-novel/site-cache-util/lib/index");
const main_1 = require("./util/main");
const util_1 = require("./util");
const bluebird_cancellation_1 = __importDefault(require("bluebird-cancellation"));
exports.default = index_1.lazyRun(async () => {
    let bool = await bluebird_cancellation_1.default.resolve(util_1.getApiClient())
        .catch(e => {
        util_1.console.red.dir(e);
        util_1.console.red(`伺服器可能發生錯誤，無法連線`);
        return null;
    });
    if (bool == null) {
        return;
    }
    await index_1.lazyImport('./build/toplist', require);
    await index_1.lazyImport('./build/task001', require);
    await index_1.lazyImport('./build/merge', require);
    await index_1.lazyImport('./build/merge002', require);
    await index_1.lazyImport('./build/cache', require);
    await index_1.lazyImport('./build/task_logined', require);
}, {
    pkgLabel: main_1.pkgLabel,
});
//# sourceMappingURL=build.js.map