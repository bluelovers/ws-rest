"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._formData = void 0;
function _formData($) {
    return {
        /**
         * chapter_id
         */
        rid: $(':hidden[name="rid"]:eq(0)').val(),
        tid: $(':hidden[name="tid"]:eq(0)').val(),
        /**
         * novel_id
         */
        code: $(':hidden[name="code"]:eq(0)').val(),
        token: $(':hidden[name="token"]:eq(0)').val(),
    };
}
exports._formData = _formData;
//# sourceMappingURL=_formData.js.map