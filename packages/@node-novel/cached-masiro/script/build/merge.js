"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const files_1 = __importDefault(require("../util/files"));
const bluebird_1 = __importDefault(require("@bluelovers/fast-glob/bluebird"));
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = index_1.lazyRun(async () => {
    let data = await bluebird_1.default
        .async([
        '*.json',
    ], {
        cwd: files_1.default.dirFid,
        absolute: true,
    })
        .reduce(async (a, file) => {
        let info = await fs_extra_1.readJSON(file);
        a[info.fid] = info;
        return a;
    }, {});
    await fs_extra_1.writeJSON(files_1.default.infoPack, data);
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=merge.js.map