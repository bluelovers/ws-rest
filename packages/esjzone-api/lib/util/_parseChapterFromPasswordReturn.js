"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseSiteLinkChapterFromPasswordReturn = exports._handleChapterFromPasswordReturnRaw = void 0;
function _handleChapterFromPasswordReturnRaw(json) {
    var _a;
    if ((_a = json.html) === null || _a === void 0 ? void 0 : _a.length) {
        json.html = '<meta charset="utf-8"><div class="container"><div class="forum-content">' + json.html + '</div></div>';
    }
    return json;
}
exports._handleChapterFromPasswordReturnRaw = _handleChapterFromPasswordReturnRaw;
function _parseSiteLinkChapterFromPasswordReturn(api, json, response) {
    let html = _handleChapterFromPasswordReturnRaw(json).html;
    let jsdom;
    if (html === null || html === void 0 ? void 0 : html.length) {
        jsdom = api._responseDataToJSDOM(html, response !== null && response !== void 0 ? response : (response = api.$response));
    }
    return {
        jsdom,
        response,
    };
}
exports._parseSiteLinkChapterFromPasswordReturn = _parseSiteLinkChapterFromPasswordReturn;
//# sourceMappingURL=_parseChapterFromPasswordReturn.js.map