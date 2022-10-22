"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const tslib_1 = require("tslib");
const build_1 = tslib_1.__importDefault(require("../demonovel/build"));
const build_2 = require("../sites/build");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
function build(source) {
    return bluebird_1.default.resolve(Object.keys(source))
        .reduce(async (a, siteID) => {
        switch (siteID) {
            case 'demonovel':
                a[siteID] = await (0, build_1.default)(source[siteID]);
                break;
            default:
                a[siteID] = await (0, build_2.buildCore)(siteID, source);
                break;
        }
        return a;
    }, {});
}
exports.build = build;
exports.default = build;
//# sourceMappingURL=build.js.map