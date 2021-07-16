"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getChapter = void 0;
const html_1 = require("restful-decorator-plugin-jsdom/lib/html");
const jquery_1 = require("restful-decorator-plugin-jsdom/lib/jquery");
const _getChapterData_1 = require("./_getChapterData");
function _getChapter($, chapter_id, options = {}) {
    let $content = $('.content .row .box-body.nvl-content');
    $content = (0, html_1.tryMinifyHTMLOfElem)($content);
    (0, jquery_1._p_2_br)($content.find('> p'), $, true);
    $content.find('p, br').after(`\n`);
    let imgs = [];
    const { cb } = options;
    let html;
    if (options.rawHtml) {
        html = $content.html();
    }
    $content
        .find('img[src]')
        .each((i, elem) => {
        let $elem = $(elem);
        let src = $elem.prop('src').trim();
        imgs.push(src);
        if (cb) {
            cb({
                i,
                $elem,
                $content,
                src,
                imgs,
            });
        }
    });
    let text = $content
        .text()
        .replace(/^\s+|\s+$/g, '');
    return {
        chapter_id: chapter_id.toString(),
        imgs,
        text,
        html,
        ...(0, _getChapterData_1._getChapterData)($),
    };
}
exports._getChapter = _getChapter;
//# sourceMappingURL=_getChapter.js.map