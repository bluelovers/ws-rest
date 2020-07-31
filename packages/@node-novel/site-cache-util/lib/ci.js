"use strict";
/**
 * Created by user on 2020/1/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipCi = exports.isCi = void 0;
function isCi() {
    return process.env.COMPUTERNAME !== 'USER-2019';
}
exports.isCi = isCi;
function skipCi() {
    return `\n\n[skip ci]`;
}
exports.skipCi = skipCi;
exports.default = isCi;
//# sourceMappingURL=ci.js.map