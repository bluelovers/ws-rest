"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookChapters = _getBookChapters;
const util_1 = require("../util");
const _parseSiteLink_1 = require("./_parseSiteLink");
function _getBookChapters($, _content, data) {
    let volume_order = 0;
    let chapter_order = 0;
    let body = _content.find('#chapterList').find('p.non, summary, a[href]');
    data.chapters[volume_order] = {
        volume_name: null,
        volume_order,
        chapters: [],
    };
    body
        .each((i, elem) => {
        let _this = $(elem);
        if (_this.is('.non') || _this.is('summary')) {
            let volume_name = (0, util_1.trimUnsafe)(_this.text());
            if (volume_name) {
                if (chapter_order || data.chapters[volume_order].volume_name != null) {
                    volume_order++;
                }
                data.chapters[volume_order] = {
                    volume_name,
                    volume_order,
                    chapters: [],
                };
                chapter_order = 0;
            }
        }
        else {
            let _a = _this;
            if (_a.length) {
                let chapter_link = _a.prop('href');
                let _m = (0, _parseSiteLink_1._parseSiteLink)(chapter_link);
                let chapter_name = (0, util_1.trimUnsafe)(_a.text());
                if (_m) {
                    data.chapters[volume_order]
                        .chapters
                        .push({
                        novel_id: _m.novel_id,
                        chapter_id: _m.chapter_id,
                        chapter_name,
                        chapter_order,
                        chapter_link,
                    });
                }
                else {
                    data.chapters[volume_order]
                        .chapters
                        .push({
                        chapter_name,
                        chapter_order,
                        chapter_link,
                    });
                }
                data.last_update_chapter_name = chapter_name;
            }
            chapter_order++;
        }
    });
    return data;
}
//# sourceMappingURL=_getBookChapters.js.map