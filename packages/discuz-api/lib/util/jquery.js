"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkLoginByJQuery = _checkLoginByJQuery;
exports._checkLoginUsername = _checkLoginUsername;
exports._jqForumStickThreads = _jqForumStickThreads;
exports._jqForumThreads = _jqForumThreads;
exports._jqForumThreadTypes = _jqForumThreadTypes;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const lazy_url_1 = tslib_1.__importDefault(require("lazy-url"));
const util_1 = require("../util");
/**
 * Created by user on 2019/12/17.
 */
function _checkLoginByJQuery($) {
    return $('.vwmy a[href*="uid"], #loginstatusid, a#myprompt')
        .length > 1;
}
function _checkLoginUsername($) {
    if (_checkLoginByJQuery($)) {
        let user = $('.vwmy a[href*="uid"]').text()
            .replace(/^\s+|\s+$/g, '');
        if (user.length) {
            return user;
        }
    }
    return;
}
function _jqForumStickThreads($) {
    return _jqForumThreads($, '#threadlisttableid tbody[id^="stickthread_"]').threads;
}
function _jqForumThreads($, selector = '#threadlisttableid tbody[id^="normalthread_"]') {
    let last_thread_time;
    let last_thread_subject;
    let last_thread_id;
    let threads = [];
    $(selector)
        .each((i, elem) => {
        let _tr = $(elem);
        let _a = _tr.find('th a.s.xst:eq(0)');
        let subject = (0, util_1.trimUnsafe)(_a.text());
        let tid = new lazy_url_1.default(_a.prop('href'))
            .searchParams.get('tid');
        let dateline;
        _a = _tr.find('.by:eq(0) em span');
        if (_a.length) {
            let title;
            _a.each((i, elem) => {
                let _a = $(elem);
                let text = _a.text();
                if (_a.is('[title]')) {
                    title = _a.prop('title');
                }
                else if (/\d+-\d+-\d+/.test(text)) {
                    title = text;
                }
            });
            if (/\d+-\d+-\d+/.test(title)) {
                dateline = (0, moment_1.default)(title, 'YYYY-MM-DD').unix();
            }
            else {
                throw new TypeError(_tr.html());
            }
        }
        if (last_thread_time == null) {
            last_thread_time = dateline;
            last_thread_subject = subject;
            last_thread_id = tid;
        }
        _a = _tr.find('.by:eq(0) cite a');
        let authorid;
        let author;
        if (_a.length) {
            author = _a.text();
            authorid = new lazy_url_1.default(_a.prop('href')).searchParams.get('uid');
        }
        _a = _tr.find('th a[href*="typeid="]').eq(0);
        let typeid;
        if (_a.length) {
            typeid = new lazy_url_1.default(_a.prop('href')).searchParams.get('typeid');
        }
        let thread = {
            tid,
            typeid,
            subject,
            dateline,
            author,
            authorid,
        };
        if (typeof typeid === 'undefined') {
            delete thread.typeid;
        }
        threads.push(thread);
    });
    return {
        last_thread_time,
        last_thread_id,
        last_thread_subject,
        threads,
    };
}
function _jqForumThreadTypes($) {
    let thread_types = {};
    $('#thread_types a[href*="typeid="]')
        .each((i, elem) => {
        let _a = $(elem).clone();
        _a.find('.num').remove();
        let typeid = new lazy_url_1.default(_a.prop('href'))
            .searchParams.get('typeid');
        let name = (0, util_1.trimUnsafe)(_a.text());
        thread_types[typeid] = name;
    });
    return thread_types;
}
//# sourceMappingURL=jquery.js.map