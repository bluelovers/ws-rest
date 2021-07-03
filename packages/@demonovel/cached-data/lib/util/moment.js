"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMomentBySeconds = exports.createMomentByMilliseconds = exports._process = void 0;
const tslib_1 = require("tslib");
const moment_timezone_1 = (0, tslib_1.__importDefault)(require("moment-timezone"));
function _process(moment) {
    return moment
        .utcOffset(8);
}
exports._process = _process;
function createMomentByMilliseconds(milliseconds) {
    return _process((0, moment_timezone_1.default)(milliseconds));
}
exports.createMomentByMilliseconds = createMomentByMilliseconds;
function createMomentBySeconds(unix) {
    return _process(moment_timezone_1.default.unix(unix));
}
exports.createMomentBySeconds = createMomentBySeconds;
//# sourceMappingURL=moment.js.map