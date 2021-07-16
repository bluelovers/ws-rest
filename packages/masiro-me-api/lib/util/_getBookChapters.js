"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookChapters = void 0;
const trim_1 = require("./trim");
const _parseSiteLink_1 = require("./_parseSiteLink");
function _getBookChapters($) {
    let volume_order = 0;
    let chapter_order = 0;
    const root = [];
    root[volume_order] = {
        volume_name: null,
        volume_order,
        chapters: [],
    };
    $('.content .box-body .chapter-content .chapter-ul').find('.chapter-box, .episode-box')
        .each((i, elem) => {
        let _this = $(elem);
        if (_this.is('.chapter-box')) {
            _this.find('.sign.minus').remove();
            let volume_name = (0, trim_1.trimUnsafe)(_this.text());
            if (volume_name) {
                if (chapter_order || root[volume_order].volume_name != null) {
                    volume_order++;
                }
                root[volume_order] = {
                    volume_name,
                    volume_order,
                    chapters: [],
                };
                chapter_order = 0;
            }
        }
        else {
            let _a = _this.parent('a:eq(0)');
            let chapter_link = _a.prop('href');
            let _m = (0, _parseSiteLink_1._parseSiteLink)(chapter_link);
            let chapter_name = (0, trim_1.trimUnsafe)(_a.find('span:eq(0)').text());
            if (!(_m === null || _m === void 0 ? void 0 : _m.chapter_id)) {
                throw new Error(`failed to parse ${chapter_link} ／ ${chapter_name}`);
            }
            root[volume_order]
                .chapters
                .push({
                chapter_id: _m.chapter_id,
                chapter_name,
                chapter_order,
            });
            chapter_order++;
        }
    });
    return root;
}
exports._getBookChapters = _getBookChapters;
//# sourceMappingURL=_getBookChapters.js.map