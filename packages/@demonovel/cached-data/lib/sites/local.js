"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = fetch;
exports.fetchFile = fetchFile;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("./util");
const fs_extra_1 = require("fs-extra");
function fetch(siteID) {
    let { url, file, file2 } = (0, util_1._handleOptions)(siteID);
    return bluebird_1.default.resolve()
        .then(v => (0, fs_extra_1.copy)(require.resolve(file2), file, {
        dereference: true,
        overwrite: true,
        preserveTimestamps: true,
    }))
        .then(v => (0, fs_extra_1.readJSON)(file));
}
function fetchFile(siteID, force) {
    return fetch(siteID);
}
exports.default = fetchFile;
//# sourceMappingURL=local.js.map