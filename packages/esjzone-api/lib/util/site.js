"use strict";
/**
 * Created by user on 2019/12/19.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._getChapterData = exports._getChapterDomContent = exports._getBookLinks = exports._getBookInfo = exports._matchDateString = exports._getBookChapters = exports._parseSiteLink = exports._getBookTags = exports._getBookCover = exports._getBookElemDesc = exports._remove_ad = exports._fixCoverUrl = exports.parseUrl = void 0;
const tslib_1 = require("tslib");
const lazy_url_1 = require("lazy-url");
const util_1 = require("../util");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const parse_input_url_1 = require("@node-novel/parse-input-url");
const array_hyper_unique_1 = require("array-hyper-unique");
function parseUrl(input) {
    let data = (0, parse_input_url_1._handleInputUrl)(input);
    let ret = {
        ...data,
    };
    switch (data.type) {
    }
    return ret;
}
exports.parseUrl = parseUrl;
function _fixCoverUrl(cover) {
    if (!cover) {
        return;
    }
    let u = new lazy_url_1.LazyURL(cover);
    if (/esjzone/.test(u.host) && u.pathname.includes('empty.jpg')) {
        return;
    }
    return u.toRealString();
}
exports._fixCoverUrl = _fixCoverUrl;
function _remove_ad($) {
    $('p[class]:has(> script), script[src*=google], > .adsbygoogle').remove();
}
exports._remove_ad = _remove_ad;
function _getBookElemDesc($) {
    return $('#details .description');
}
exports._getBookElemDesc = _getBookElemDesc;
function _getBookCover($) {
    let _cover;
    $('.container .product-gallery')
        .find(`.gallery-item img[src], a img[src]`)
        .toArray()
        .some((elem) => {
        let cover = _fixCoverUrl($(elem).prop('src'));
        if (cover = _fixCoverUrl(cover)) {
            return _cover = cover;
        }
    });
    return _cover;
}
exports._getBookCover = _getBookCover;
function _getBookTags($, tags = []) {
    $('.widget-tags a.tag[href*="tag"]')
        .each((i, elem) => {
        let _this = $(elem);
        let name = (0, util_1.trimUnsafe)(_this.text());
        if (name.length) {
            tags.push(name);
        }
    });
    $('.page-title .container .column h1')
        .each((i, elem) => {
        let _this = $(elem);
        let name = (0, util_1.trimUnsafe)(_this.text());
        if (name.length) {
            tags.push(name);
        }
    });
    (0, array_hyper_unique_1.array_unique_overwrite)(tags);
    return tags;
}
exports._getBookTags = _getBookTags;
function _parseSiteLink(chapter_link) {
    let _m = chapter_link
        .match(/esjzone\.cc\/forum\/(\d+)\/(\d+)\.html?/);
    let novel_id;
    let chapter_id;
    if (_m) {
        novel_id = _m[1];
        chapter_id = _m[2];
        return {
            novel_id,
            chapter_id,
        };
    }
    _m = chapter_link
        .match(/esjzone\.cc\/detail\/(\d+)/);
    if (_m) {
        novel_id = _m[1];
        return {
            novel_id,
        };
    }
}
exports._parseSiteLink = _parseSiteLink;
function _getBookChapters($, _content, data) {
    let volume_order = 0;
    let chapter_order = 0;
    let body = _content.find('#chapterList').find('p.non, a[href]');
    data.chapters[volume_order] = {
        volume_name: null,
        volume_order,
        chapters: [],
    };
    body
        .each((i, elem) => {
        let _this = $(elem);
        if (_this.is('.non')) {
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
                let _m = _parseSiteLink(chapter_link);
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
exports._getBookChapters = _getBookChapters;
function _matchDateString(_text) {
    return _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2})\b/) || _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2})\b/);
}
exports._matchDateString = _matchDateString;
function _getBookInfo($, data) {
    var _b;
    data.name = (0, util_1.trimUnsafe)($('.container .row:eq(0) h2:eq(0)').text());
    $('.book-detail > li')
        .each(function (i, elem) {
        var _b;
        let _this = $(this);
        let _text = (0, util_1.trimUnsafe)(_this.text());
        let _m;
        if (_m = _text.match(/作者\s*[：:]\s*([^\n]+)/)) {
            data.authors = (0, util_1.trimUnsafe)(_m[1]);
        }
        else if (_m = _text.match(/(?:书|書)名\s*[：:]\s*([^\n]+)/)) {
            let title = (0, util_1.trimUnsafe)(_m[1]);
            if (title.length > 0 && title !== data.name) {
                (_b = data.titles) !== null && _b !== void 0 ? _b : (data.titles = []);
                data.titles.push((0, util_1.trimUnsafe)(_m[1]));
            }
        }
        else if (_m = _matchDateString(_text)) {
            try {
                let last_update_time = (0, moment_1.default)(_m[1]).unix();
                data.last_update_time = last_update_time;
            }
            catch (e) {
            }
        }
    });
    if ((_b = data.titles) === null || _b === void 0 ? void 0 : _b.length) {
        (0, array_hyper_unique_1.array_unique_overwrite)(data.titles);
    }
    return data;
}
exports._getBookInfo = _getBookInfo;
function _getBookLinks($, links = []) {
    $('.book-detail')
        .find('a[href]')
        .not('.btn, .form-group *')
        .each((i, elem) => {
        let _this = $(elem);
        let name = (0, util_1.trimUnsafe)(_this.text());
        let href = _this.prop('href');
        if (name === href || name === '') {
            name = undefined;
        }
        if (!href.length || href === 'https://www.esjzone.cc/tags//') {
            return;
        }
        links.push({
            name,
            href,
        });
    });
    return links;
}
exports._getBookLinks = _getBookLinks;
function _getChapterDomContent($) {
    return $('.container .forum-content');
}
exports._getChapterDomContent = _getChapterDomContent;
function _getChapterData($) {
    let $meta = $('.container .single-post-meta .column');
    $meta.eq(0).find('span:eq(0)').remove();
    $meta.eq(1).find('i:eq(0)').remove();
    let author = (0, util_1.trimUnsafe)($meta.eq(0).text());
    let dateline;
    let _m = _matchDateString((0, util_1.trimUnsafe)($meta.eq(1).text()));
    if (_m) {
        let unix = (0, moment_1.default)(_m[1]).unix();
        if (unix > 0) {
            dateline = unix;
        }
    }
    let chapter_name = (0, util_1.trimUnsafe)($('.container .row .single-post-meta + h2').text());
    return {
        chapter_name,
        author,
        dateline,
    };
}
exports._getChapterData = _getChapterData;
//# sourceMappingURL=site.js.map