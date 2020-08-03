"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueToArray = exports.isForkFrom = exports.toBase64 = void 0;
// @ts-ignore
const is_base64_1 = __importDefault(require("is-base64"));
function toBase64(content) {
    if (typeof content !== 'string' || !is_base64_1.default(content)) {
        // @ts-ignore
        return Buffer.from(content).toString('base64');
    }
    return content;
}
exports.toBase64 = toBase64;
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
exports.isForkFrom = isForkFrom;
function valueToArray(input) {
    return Array.isArray(input) ? input : [input];
}
exports.valueToArray = valueToArray;
//# sourceMappingURL=util.js.map