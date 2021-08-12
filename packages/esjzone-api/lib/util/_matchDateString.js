"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._matchDateString = void 0;
function _matchDateString(_text) {
    return _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2})\b/) || _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2})\b/);
}
exports._matchDateString = _matchDateString;
//# sourceMappingURL=_matchDateString.js.map