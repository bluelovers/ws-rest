"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBase64 = toBase64;
exports.isForkFrom = isForkFrom;
exports.valueToArray = valueToArray;
const tslib_1 = require("tslib");
// @ts-ignore
const is_base64_1 = tslib_1.__importDefault(require("is-base64"));
function toBase64(content) {
    if (typeof content !== 'string' || !(0, is_base64_1.default)(content)) {
        // @ts-ignore
        return Buffer.from(content).toString('base64');
    }
    return content;
}
function isForkFrom(repoData, target) {
    const { owner, repo } = target;
    const full_name = [owner, repo].join('/');
    let { parent } = repoData;
    while (parent) {
        if (parent.path === repo && parent.namespace.path === owner) {
            return true;
        }
        if (parent.full_name === full_name) {
            return true;
        }
        parent = parent.parent;
    }
    return false;
}
function valueToArray(input) {
    return Array.isArray(input) ? input : [input];
}
//# sourceMappingURL=util.js.map