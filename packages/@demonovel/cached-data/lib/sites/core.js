"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.fetch = void 0;
const fetch_1 = __importDefault(require("../util/fetch"));
const fs_1 = require("../util/fs");
const util_1 = require("./util");
function fetch(siteID) {
    let { url, file, file2 } = util_1._handleOptions(siteID);
    return fetch_1.default(url, file);
}
exports.fetch = fetch;
function fetchFile(siteID, force) {
    let { url, file } = util_1._handleOptions(siteID);
    return fs_1.readJSONWithFetch(file, () => fetch(siteID), force);
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=core.js.map