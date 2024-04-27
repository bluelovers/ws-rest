"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCore = buildCore;
exports.build = build;
const tslib_1 = require("tslib");
const util_1 = require("./build/util");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const esjzone_1 = tslib_1.__importDefault(require("./build/esjzone"));
const default_1 = tslib_1.__importDefault(require("./build/default"));
const masiro_1 = tslib_1.__importDefault(require("./build/masiro"));
const masiro_me_1 = require("./build/masiro_me");
function buildCore(siteID, source) {
    let fn;
    switch (siteID) {
        case 'esjzone':
            fn = esjzone_1.default;
            break;
        case 'dmzj':
        case 'wenku8':
            fn = default_1.default;
            break;
        case 'masiro':
            fn = masiro_1.default;
            break;
        case 'masiro_me':
            fn = masiro_me_1.buildMasiroMe;
            break;
    }
    return (0, util_1.handleEntries)(siteID, source, fn);
}
function build(source) {
    return bluebird_1.default
        .resolve(Object.keys(source))
        .reduce((a, siteID) => {
        a[siteID] = buildCore(siteID, source);
        return a;
    }, {});
}
exports.default = buildCore;
//# sourceMappingURL=build.js.map