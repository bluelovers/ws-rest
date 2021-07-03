"use strict";
/**
 * Created by user on 2019/6/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parseFile = exports.parse = void 0;
const tslib_1 = require("tslib");
const crlf_normalize_1 = (0, tslib_1.__importStar)(require("crlf-normalize"));
const index_1 = (0, tslib_1.__importDefault)(require("../../index"));
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
    return (0, crlf_normalize_1.default)(input)
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