"use strict";
/**
 * Created by user on 2019/6/10.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parseFile = exports.parse = void 0;
const crlf_normalize_1 = __importStar(require("crlf-normalize"));
const index_1 = __importDefault(require("../../index"));
function parse(line) {
    line = line.trim();
    if (!line.startsWith('#') && line.length) {
        let [domain, path, key, value, expires] = line.split('\t');
        // @ts-ignore
        expires = new Date(Date.parse(expires));
        let cookies = new index_1.default({
            domain,
            path,
            key,
            value,
            expires: expires
        });
        return cookies;
    }
}
exports.parse = parse;
function parseFile(input) {
    if (typeof input !== 'string') {
        if (!input || !input.length) {
            throw new TypeError(`input is invalid : ${input}`);
        }
        input = input.toString();
    }
    return crlf_normalize_1.default(input)
        .split(crlf_normalize_1.LF)
        .reduce((arr, line) => {
        let cookies = parse(line.trim());
        if (cookies) {
            arr.push(cookies);
        }
        return arr;
    }, []);
}
exports.parseFile = parseFile;
function stringify(cookie, skipInvalid) {
    let { domain, path, key, value, expires } = cookie;
    if (domain == null || path == null || key == null) {
        if (!skipInvalid) {
            throw new TypeError(`can't stringify, field is miss ${cookie}`);
        }
    }
    return [domain, path, key, value, new Date(expires).toUTCString()].join('\t');
}
exports.stringify = stringify;
exports.default = parseFile;
//# sourceMappingURL=idea.js.map