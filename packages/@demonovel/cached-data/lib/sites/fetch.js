"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.fetch = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const core_1 = tslib_1.__importStar(require("./core"));
const local_1 = tslib_1.__importDefault(require("./local"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
function fetch(opts = {}) {
    return bluebird_1.default
        .resolve(Object.keys(types_1.id_packs_map))
        .reduce(async (a, siteID) => {
        if (opts.local) {
            a[siteID] = await (0, local_1.default)(siteID);
        }
        else {
            a[siteID] = await (0, core_1.fetch)(siteID)
                .timeout(5000)
                .catch(e => (0, local_1.default)(siteID));
        }
        return a;
    }, {});
}
exports.fetch = fetch;
function fetchFile(force, opts) {
    return bluebird_1.default
        .resolve(Object.keys(types_1.id_packs_map))
        .reduce(async (a, siteID) => {
        if (opts.local) {
            a[siteID] = await (0, local_1.default)(siteID);
        }
        else {
            a[siteID] = await (0, core_1.default)(siteID, force)
                .timeout(5000)
                .catch(e => (0, local_1.default)(siteID));
        }
        return a;
    }, {});
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=fetch.js.map