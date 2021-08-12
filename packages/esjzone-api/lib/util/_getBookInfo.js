"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookInfo = void 0;
const tslib_1 = require("tslib");
const util_1 = require("../util");
const const_1 = require("./const");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const array_hyper_unique_1 = require("array-hyper-unique");
const _matchDateString_1 = require("./_matchDateString");
function _getBookInfo($, data) {
    var _a;
    data.name = (0, util_1.trimUnsafe)($('.container .row:eq(0) h2:eq(0)').text());
    $('.book-detail > li')
        .each(function (i, elem) {
        var _a, _b;
        let _this = $(this);
        let _text = (0, util_1.trimUnsafe)(_this.text());
        let _m;
        if (_m = _text.match(const_1.reAuthors)) {
            data.authors = (0, util_1.trimUnsafe)(_m[1]);
        }
        else if (_m = _text.match(const_1.reTitle)) {
            let title = (0, util_1.trimUnsafe)(_m[1]);
            if (title.length > 0 && title !== data.name) {
                (_a = data.titles) !== null && _a !== void 0 ? _a : (data.titles = []);
                data.titles.push((0, util_1.trimUnsafe)(_m[1]));
            }
        }
        else if (_m = _text.match(const_1.reType)) {
            let _s = (0, util_1.trimUnsafe)(_m[1]);
            if (_s.length) {
                (_b = data.tags) !== null && _b !== void 0 ? _b : (data.tags = []);
                data.tags.push(_s);
            }
        }
        else if (_m = (0, _matchDateString_1._matchDateString)(_text)) {
            try {
                let last_update_time = (0, moment_1.default)(_m[1]).unix();
                data.last_update_time = last_update_time;
            }
            catch (e) {
            }
        }
    });
    if ((_a = data.titles) === null || _a === void 0 ? void 0 : _a.length) {
        (0, array_hyper_unique_1.array_unique_overwrite)(data.titles);
    }
    return data;
}
exports._getBookInfo = _getBookInfo;
//# sourceMappingURL=_getBookInfo.js.map