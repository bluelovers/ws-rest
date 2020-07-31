"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMomentBySeconds = exports.createMomentByMilliseconds = exports._process = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function _process(moment) {
    return moment
        .utcOffset(8);
}
exports._process = _process;
function createMomentByMilliseconds(milliseconds) {
    return _process(moment_timezone_1.default(milliseconds));
}
exports.createMomentByMilliseconds = createMomentByMilliseconds;
function createMomentBySeconds(unix) {
    return _process(moment_timezone_1.default.unix(unix));
}
exports.createMomentBySeconds = createMomentBySeconds;
//# sourceMappingURL=moment.js.map