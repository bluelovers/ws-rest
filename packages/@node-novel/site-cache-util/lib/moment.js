"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixMoment = exports.toMoment = exports.moment = void 0;
// @ts-ignore
__exportStar(require("moment"), exports);
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.moment = moment_timezone_1.default;
let defaultTimeZone = "Asia/Taipei";
moment_timezone_1.default.tz.setDefault(defaultTimeZone);
function toMoment(inp, ...argv) {
    return moment_timezone_1.default(inp, ...argv);
}
exports.toMoment = toMoment;
function unixMoment(timestamp) {
    return moment_timezone_1.default.unix(timestamp);
}
exports.unixMoment = unixMoment;
exports.default = moment_timezone_1.default;
//# sourceMappingURL=moment.js.map