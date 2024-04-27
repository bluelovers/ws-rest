"use strict";
/**
 * Created by user on 2020/3/2.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchFileAll;
const tslib_1 = require("tslib");
const demonovel_1 = tslib_1.__importDefault(require("../demonovel"));
const sites_1 = tslib_1.__importDefault(require("../sites"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
function fetchFileAll(force, opts) {
    return bluebird_1.default.props({
        a: (0, sites_1.default)(force, opts),
        b: (0, demonovel_1.default)(force),
    })
        .then(async (data) => {
        return {
            ...data.a,
            ...data.b,
        };
    });
}
//# sourceMappingURL=index.js.map