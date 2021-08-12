"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleChapterContent = exports._handleChapterContentCore = exports._handleChapterContentRoot = void 0;
const html_1 = require("restful-decorator-plugin-jsdom/lib/html");
const _remove_ad_1 = require("./_remove_ad");
const _getChapterDomContent_1 = require("./_getChapterDomContent");
const jquery_1 = require("restful-decorator-plugin-jsdom/lib/jquery");
const _getChapterData_1 = require("./_getChapterData");
const _checkChapterLock_1 = require("./_checkChapterLock");
function _handleChapterContentRoot($, argv, options) {
    let $content = $('.container .row:has(.forum-content)');
    $content = (0, html_1.tryMinifyHTMLOfElem)($content);
    (0, _remove_ad_1._remove_ad)($);
    return $content;
}
exports._handleChapterContentRoot = _handleChapterContentRoot;
function _handleChapterContentCore($, argv, options) {
    options !== null && options !== void 0 ? options : (options = {});
    /*
    const _decodeChapter = async () =>
    {
        let code: string;

        if (!code)
        {
            code = _getCode(jsdom.serialize());
        }

        if (!code)
        {
            $('script')
                .each((i, elem) =>
                {

                    let html = $(elem).text();

                    code = _getCode(html);
                })
            ;
        }

        await this._getDecodeChapter({
                novel_id: argv.novel_id,
                chapter_id: argv.chapter_id,
                code,
            })
            .then(a =>
            {
                let elems = $('.trans, .t');

                a.forEach((v, i) =>
                {
                    elems.eq(i).html(v);
                });

                return a;
            })
        ;

        function _getCode(html: string): string
        {
            let m = html
                .match(/getTranslation\(['"]([^\'"]+)['"]/i)
            ;

            if (m)
            {
                return m[1];
            }
        }
    };

    //await _decodeChapter();

    //_remove_ad($);
     */
    let $content = (0, _getChapterDomContent_1._getChapterDomContent)($);
    (0, jquery_1._p_2_br)($content.find('> p'), $);
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
    let { author, dateline } = (0, _getChapterData_1._getChapterData)($);
    return {
        locked: false,
        imgs,
        text,
        html,
    };
}
exports._handleChapterContentCore = _handleChapterContentCore;
function _handleChapterContent($, argv, options) {
    let _check = (0, _checkChapterLock_1._checkChapterLock)($);
    let ret = {
        locked: _check.locked,
    };
    if (!_check.locked) {
        ret = _handleChapterContentCore($, argv, options);
    }
    return ret;
}
exports._handleChapterContent = _handleChapterContent;
//# sourceMappingURL=_handleChapterContent.js.map