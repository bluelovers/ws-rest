"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = index_1.lazyRun(async () => {
    const { api, saveCache } = await util_1.getApiClient();
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=fix.js.map