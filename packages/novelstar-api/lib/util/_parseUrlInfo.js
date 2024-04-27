"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseUrlInfo = _parseUrlInfo;
exports._buildURLByParseUrlInfo = _buildURLByParseUrlInfo;
const parse_input_url_1 = require("@node-novel/parse-input-url");
/**
 * 支援
 * - https://www.novelstar.com.tw/books/7495.html
 */
function _parseUrlInfo(input) {
    const data = (0, parse_input_url_1._handleInputUrl)(input);
    let novel_id;
    let chapter_id;
    let user_id;
    let value;
    switch (data.type) {
        case parse_input_url_1.EnumParseInputUrl.NUMBER:
            novel_id = data.value;
            break;
        case parse_input_url_1.EnumParseInputUrl.URL:
            value = data.value.toRealString();
        case parse_input_url_1.EnumParseInputUrl.URLSEARCHPARAMS:
        case parse_input_url_1.EnumParseInputUrl.STRING:
            value !== null && value !== void 0 ? value : (value = data.value);
            value = value.toString();
            let m;
            if (m = /books\/(\d+)\.html/.exec(value)) {
                novel_id = m[1];
                break;
            }
            if (m = /author\/(\d+)\.html/.exec(value)) {
                user_id = m[1];
                break;
            }
            if (m = /read\.php\?id=(\d+)/.exec(value)) {
                chapter_id = m[1];
                break;
            }
    }
    value !== null && value !== void 0 ? value : (value = data.value);
    return {
        novel_id,
        chapter_id,
        user_id,
        value,
        _input: data._input,
    };
}
function _buildURLByParseUrlInfo(input, baseURL) {
    baseURL !== null && baseURL !== void 0 ? baseURL : (baseURL = 'https://www.novelstar.com.tw/');
    if (input.novel_id) {
        return `${baseURL}/books/${input.novel_id}.html`;
    }
    else if (input.chapter_id) {
        return `${baseURL}/admin/novelReading?cid=${input.chapter_id}`;
    }
    else if (input.user_id) {
        return `${baseURL}/author/${input.user_id}.html`;
    }
}
//# sourceMappingURL=_parseUrlInfo.js.map