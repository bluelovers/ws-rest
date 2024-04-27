"use strict";
/**
 * Created by user on 2020/1/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCi = isCi;
exports.skipCi = skipCi;
function isCi() {
    return process.env.COMPUTERNAME !== 'USER-2019';
}
function skipCi() {
    return `\n\n[skip ci]`;
}
exports.default = isCi;
//# sourceMappingURL=ci.js.map