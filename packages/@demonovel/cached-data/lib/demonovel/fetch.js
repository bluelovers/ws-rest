"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.fetch = void 0;
const tslib_1 = require("tslib");
const core_1 = (0, tslib_1.__importStar)(require("./core"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const types_1 = require("./types");
function fetch() {
    return bluebird_1.default.props({
        [types_1.siteID]: (0, core_1.fetch)(),
    });
}
exports.fetch = fetch;
function fetchFile(force) {
    return bluebird_1.default.props({
        [types_1.siteID]: (0, core_1.default)(force),
    });
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=fetch.js.map