"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getChapterData = _getChapterData;
const trim_1 = require("./trim");
function _getChapterData($) {
    var _a, _b;
    $('.translator-info').find('.smallThumb, :input, #smallThumb').remove();
    let info = (0, trim_1.trimUnsafe)($('.translator-info').text());
    let memo = (0, trim_1.trimUnsafe)($('.translator-memo').text());
    let data;
    if (info.length) {
        data !== null && data !== void 0 ? data : (data = {});
        (_a = data.extra_info) !== null && _a !== void 0 ? _a : (data.extra_info = {});
        data.extra_info.info = info;
    }
    if (memo.length) {
        data !== null && data !== void 0 ? data : (data = {});
        (_b = data.extra_info) !== null && _b !== void 0 ? _b : (data.extra_info = {});
        data.extra_info.memo = memo;
    }
    return data !== null && data !== void 0 ? data : null;
}
//# sourceMappingURL=_getChapterData.js.map