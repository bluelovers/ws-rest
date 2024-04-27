"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._process = _process;
exports.createMomentByMilliseconds = createMomentByMilliseconds;
exports.createMomentBySeconds = createMomentBySeconds;
const tslib_1 = require("tslib");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
function _process(moment) {
    return moment
        .utcOffset(8);
}
function createMomentByMilliseconds(milliseconds) {
    return _process((0, moment_timezone_1.default)(milliseconds));
}
function createMomentBySeconds(unix) {
    return _process(moment_timezone_1.default.unix(unix));
}
//# sourceMappingURL=moment.js.map