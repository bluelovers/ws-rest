"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseUrlInfo = _parseUrlInfo;
exports._buildURLByParseUrlInfo = _buildURLByParseUrlInfo;
const parse_input_url_1 = require("@node-novel/parse-input-url");
/**
 * 支援
 * - https://masi.ro/n378
 * - https://masi.ro/c29630
 * - https://masi.ro/p6172
 * - https://masi.ro/f25
 * - novel_id=
 * - cid=
 * - forum_id=
 * - post_id=
 * - user_id=
 */
function _parseUrlInfo(input) {
    const data = (0, parse_input_url_1._handleInputUrl)(input);
    let novel_id;
    let chapter_id;
    let forum_id;
    let post_id;
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
            if (m = /^n?(\d+)$/.exec(value)) {
                novel_id = m[1];
                break;
            }
            if (m = /masi\.ro\/n(\d+)/.exec(value)) {
                novel_id = m[1];
                break;
            }
            if (m = /masi\.ro\/c(\d+)$/.exec(value)) {
                chapter_id = m[1];
                break;
            }
            if (m = /masi\.ro\/f(\d+)/.exec(value)) {
                forum_id = m[1];
                break;
            }
            if (m = /masi\.ro\/p(\d+)$/.exec(value)) {
                post_id = m[1];
                break;
            }
            if (m = /novel_id=(\d+)/.exec(value)) {
                novel_id = m[1];
                break;
            }
            if (m = /cid=(\d+)/.exec(value)) {
                chapter_id = m[1];
                break;
            }
            if (m = /forum_id=(\d+)/.exec(value)) {
                forum_id = m[1];
                break;
            }
            if (m = /post_id=(\d+)/.exec(value)) {
                post_id = m[1];
                break;
            }
            if (m = /user_id=(\d+)/.exec(value)) {
                user_id = m[1];
                break;
            }
    }
    value !== null && value !== void 0 ? value : (value = data.value);
    return {
        novel_id,
        chapter_id,
        forum_id,
        post_id,
        user_id,
        value,
        _input: data._input,
    };
}
function _buildURLByParseUrlInfo(input, baseURL) {
    baseURL !== null && baseURL !== void 0 ? baseURL : (baseURL = 'https://masiro.me');
    if (input.novel_id) {
        return `${baseURL}/admin/novelView?novel_id=${input.novel_id}`;
    }
    else if (input.chapter_id) {
        return `${baseURL}/admin/novelReading?cid=${input.chapter_id}`;
    }
    else if (input.forum_id) {
        return `${baseURL}/admin/forum?forum_id=${input.forum_id}`;
    }
    else if (input.post_id) {
        return `${baseURL}/admin/post?post_id=${input.post_id}`;
    }
    else if (input.user_id) {
        return `${baseURL}/admin/userCenterShow?user_id=${input.user_id}`;
    }
}
//# sourceMappingURL=_parseUrlInfo.js.map