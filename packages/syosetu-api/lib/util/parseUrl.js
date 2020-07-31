"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUrl = exports.buildLink = exports.parseUrlInfo = void 0;
const parse_input_url_1 = require("@node-novel/parse-input-url");
const lazy_url_1 = require("lazy-url");
const valid_1 = require("./valid");
function parseUrlInfo(input) {
    const data = parse_input_url_1._handleInputUrl(input);
    let novel_r18;
    let novel_id;
    let chapter_id;
    let value;
    switch (data.type) {
        case parse_input_url_1.EnumParseInputUrl.NUMBER:
            chapter_id = data.value;
            break;
        case parse_input_url_1.EnumParseInputUrl.URL:
            value = data.value.toRealString();
        //break;
        case parse_input_url_1.EnumParseInputUrl.STRING:
            value = value !== null && value !== void 0 ? value : data.value;
            if (valid_1.validNcode(value)) {
                novel_id = value;
                break;
            }
            if (/(novel18)\.syosetu\.com/.test(value)) {
                novel_r18 = true;
            }
            let r;
            let m;
            r = /\.syosetu\.com\/(n\w{5,6})(?:\/?(\d+))?/;
            if (m = r.exec(value)) {
                novel_id = m[1];
                chapter_id = m[2];
                break;
            }
            r = /\/?(n\w{5,6})\/(\d+)\//;
            if (m = r.exec(value)) {
                novel_id = m[1];
                chapter_id = m[2];
                break;
            }
            break;
    }
    return {
        novel_r18,
        novel_id,
        chapter_id,
    };
}
exports.parseUrlInfo = parseUrlInfo;
function buildLink(data) {
    var _a, _b;
    return `${(_a = data.protocol) !== null && _a !== void 0 ? _a : 'http:'}//${data.novel_r18 ? 'novel18' : 'ncode'}.syosetu.com/${data.novel_id}/${(_b = data.chapter_id) !== null && _b !== void 0 ? _b : ''}`;
}
exports.buildLink = buildLink;
function buildUrl(data) {
    return new lazy_url_1.LazyURL(buildLink(data));
}
exports.buildUrl = buildUrl;
//# sourceMappingURL=parseUrl.js.map