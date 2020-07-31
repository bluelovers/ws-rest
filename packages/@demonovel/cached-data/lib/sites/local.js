"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.fetch = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("./util");
const fs_extra_1 = require("fs-extra");
function fetch(siteID) {
    let { url, file, file2 } = util_1._handleOptions(siteID);
    return bluebird_1.default.resolve()
        .then(v => fs_extra_1.copy(require.resolve(file2), file, {
        dereference: true,
        overwrite: true,
        preserveTimestamps: true,
    }))
        .then(v => fs_extra_1.readJSON(file));
}
exports.fetch = fetch;
function fetchFile(siteID, force) {
    return fetch(siteID);
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=local.js.map