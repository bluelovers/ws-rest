"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookTranslator = _getBookTranslator;
const trim_1 = require("./trim");
function _getBookTranslator($, translator = []) {
    $('.n-detail .n-translator a')
        .each((index, elem) => {
        let s = (0, trim_1.trimUnsafe)($(elem).text());
        if (s.length) {
            translator !== null && translator !== void 0 ? translator : (translator = []);
            translator.push(s);
        }
    });
    return translator;
}
//# sourceMappingURL=_getBookTranslator.js.map