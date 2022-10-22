"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._sortBookFields = void 0;
const tslib_1 = require("tslib");
const sort_object_keys2_1 = tslib_1.__importDefault(require("sort-object-keys2"));
function _sortBookFields(book) {
    return (0, sort_object_keys2_1.default)(book, {
        keys: [
            'id',
            'title',
            'titles',
            'cover',
            'authors',
            'translator',
            'updated',
            'status',
            'status_text',
            'chapters_num',
            'last_update_name',
            'tags',
            'content',
            'chapters',
        ],
        useSource: true,
    });
}
exports._sortBookFields = _sortBookFields;
//# sourceMappingURL=_sortBookFields.js.map