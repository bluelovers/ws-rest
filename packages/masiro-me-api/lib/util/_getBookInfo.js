"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookInfo = void 0;
const tslib_1 = require("tslib");
const trim_1 = require("./trim");
const _getBookTranslator_1 = require("./_getBookTranslator");
const _getBookTags_1 = require("./_getBookTags");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const regexp_cjk_1 = require("regexp-cjk");
const _handleBookInfo_1 = require("./_handleBookInfo");
function _getBookInfo($, novel_id) {
    novel_id = novel_id.toString();
    let authors = [];
    let _author = (0, trim_1.trimUnsafe)($('.n-detail .author').text());
    if (_author.length) {
        authors.push(_author);
    }
    let translator = (0, _getBookTranslator_1._getBookTranslator)($);
    let tags = (0, _getBookTags_1._getBookTags)($);
    let _date = (0, trim_1.trimUnsafe)($('.n-detail .n-update .s-font').text());
    let updated;
    if (_date === null || _date === void 0 ? void 0 : _date.length) {
        updated = (0, moment_1.default)(_date).valueOf();
    }
    let content = (0, trim_1.trimUnsafe)($('.content .brief').text())
        .replace(new regexp_cjk_1.zhRegExp(/^简介(?:：|:)\s*/), '');
    let title = (0, trim_1.trimUnsafe)($('.novel-title').text());
    let book = {
        id: novel_id,
        title,
        authors,
        translator,
        tags,
        updated,
        content,
    };
    (0, _handleBookInfo_1._handleBookInfo)(book);
    return book;
}
exports._getBookInfo = _getBookInfo;
//# sourceMappingURL=_getBookInfo.js.map