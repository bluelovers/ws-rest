"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.fetch = void 0;
const tslib_1 = require("tslib");
const fetch_1 = tslib_1.__importDefault(require("../util/fetch"));
const fs_1 = require("../util/fs");
const util_1 = require("./util");
function fetch(siteID) {
    let { url, file, file2 } = (0, util_1._handleOptions)(siteID);
    return (0, fetch_1.default)(url, file);
}
exports.fetch = fetch;
function fetchFile(siteID, force) {
    let { url, file } = (0, util_1._handleOptions)(siteID);
    return (0, fs_1.readJSONWithFetch)(file, () => fetch(siteID), force);
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=core.js.map