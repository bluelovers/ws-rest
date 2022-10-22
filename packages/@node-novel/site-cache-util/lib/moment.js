"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixMoment = exports.toMoment = exports.moment = void 0;
const tslib_1 = require("tslib");
// @ts-ignore
tslib_1.__exportStar(require("moment"), exports);
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
exports.moment = moment_timezone_1.default;
let defaultTimeZone = "Asia/Taipei";
moment_timezone_1.default.tz.setDefault(defaultTimeZone);
function toMoment(inp, ...argv) {
    return (0, moment_timezone_1.default)(inp, ...argv);
}
exports.toMoment = toMoment;
function unixMoment(timestamp) {
    return moment_timezone_1.default.unix(timestamp);
}
exports.unixMoment = unixMoment;
exports.default = moment_timezone_1.default;
//# sourceMappingURL=moment.js.map