"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getChapterData = void 0;
const tslib_1 = require("tslib");
const util_1 = require("../util");
const moment_1 = tslib_1.__importDefault(require("moment"));
const _matchDateString_1 = require("./_matchDateString");
function _getChapterData($) {
    let $meta = $('.container .single-post-meta .column');
    $meta.eq(0).find('span:eq(0)').remove();
    $meta.eq(1).find('i:eq(0)').remove();
    let author = (0, util_1.trimUnsafe)($meta.eq(0).text());
    let dateline;
    let _m = (0, _matchDateString_1._matchDateString)((0, util_1.trimUnsafe)($meta.eq(1).text()));
    if (_m) {
        let unix = (0, moment_1.default)(_m[1]).unix();
        if (unix > 0) {
            dateline = unix;
        }
    }
    let chapter_name = (0, util_1.trimUnsafe)($('.container .row .single-post-meta + h2').text());
    return {
        chapter_name,
        author,
        dateline,
    };
}
exports._getChapterData = _getChapterData;
//# sourceMappingURL=_getChapterData.js.map