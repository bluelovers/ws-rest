"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.fetch = void 0;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/3/2.
 */
const fetch_1 = (0, tslib_1.__importDefault)(require("../util/fetch"));
const fs_1 = require("../util/fs");
const types_1 = require("./types");
function fetch() {
    return (0, fetch_1.default)(types_1.url, types_1.file);
}
exports.fetch = fetch;
function fetchFile(force) {
    return (0, fs_1.readJSONWithFetch)(types_1.file, fetch, force);
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=core.js.map