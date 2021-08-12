"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkChapterLock = void 0;
const _getChapterDomContent_1 = require("./_getChapterDomContent");
const _formData_1 = require("./_formData");
function _checkChapterLock($) {
    let $content = (0, _getChapterDomContent_1._getChapterDomContent)($);
    let pw = $content.find('#pw');
    return {
        locked: pw.length > 0,
        input: pw,
        form: (0, _formData_1._formData)($),
    };
}
exports._checkChapterLock = _checkChapterLock;
//# sourceMappingURL=_checkChapterLock.js.map