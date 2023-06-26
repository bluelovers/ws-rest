"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscuzClient = void 0;
const tslib_1 = require("tslib");
const lib_1 = tslib_1.__importDefault(require("restful-decorator-plugin-jsdom/lib"));
const decorators_1 = require("restful-decorator/lib/decorators");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("./util");
const moment_1 = tslib_1.__importDefault(require("moment"));
const types_1 = require("./types");
const uniqBy_1 = tslib_1.__importDefault(require("lodash/uniqBy"));
const html_1 = tslib_1.__importDefault(require("restful-decorator-plugin-jsdom/lib/html"));
const lazy_url_1 = tslib_1.__importDefault(require("lazy-url"));
const jquery_1 = require("./util/jquery");
const lib_2 = require("@bluelovers/axios-util/lib");
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const crlf_normalize_1 = tslib_1.__importDefault(require("crlf-normalize"));
let DiscuzClient = exports.DiscuzClient = class DiscuzClient extends lib_1.default {
    constructor(...argv) {
        let [defaults = {}] = argv;
        if (!defaults.baseURL) {
            throw new TypeError(`baseURL must set`);
        }
        argv[0] = defaults;
        super(...argv);
    }
    _constructor() {
        return super._constructor();
    }
    loginByForm(inputData) {
        let jsdom = this._responseDataToJSDOM(this.$response.data, this.$response);
        let username = (0, jquery_1._checkLoginUsername)(jsdom.$);
        if (username != null) {
            return bluebird_1.default.resolve(username);
        }
        let bool = (0, jquery_1._checkLoginByJQuery)(jsdom.$);
        if (!bool) {
            return bluebird_1.default.reject(bool);
        }
        return bool;
    }
    _getAuthCookies() {
        let ret = this._jar()
            .findCookieByKey(/_(?:sid|saltkey|auth)$/, this.$baseURL)
            .reduce((a, b) => {
            let _m = /_(sid|saltkey|auth)$/.exec(b.key);
            // @ts-ignore
            a[_m[1]] = b;
            return a;
        }, {});
        return ret;
    }
    /**
     * 取得板塊資訊
     */
    forum(argv) {
        const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const { $ } = jsdom;
        let fid = String(argv.fid);
        let forum_name = $(`#ct h1 a[href$="forum.php?mod=forumdisplay&fid=${fid}"]`).text();
        forum_name = (0, util_1.trimUnsafe)(forum_name);
        let subforum_area = $(`#wp #ct #subforum_${argv.fid}.bm_c`);
        let subforums = [];
        subforum_area
            .find('.fl_g')
            .each((i, elem) => {
            let _this = $(elem);
            let _a = _this
                .find('a[href*="forumdisplay"]:eq(0)');
            let _url = new URL(_a.prop('href'));
            let forum_name;
            if (_a.find('> img[src*="forum"][alt]').length) {
                forum_name = _a.find('> img[src*="forum"][alt]').prop('alt');
            }
            else {
                forum_name = _a.text();
            }
            forum_name = (0, util_1.trimUnsafe)(forum_name);
            let fid = _url.searchParams.get('fid');
            subforums.push({
                fid,
                forum_name,
            });
        });
        let thread_types = (0, jquery_1._jqForumThreadTypes)($);
        let { threads, last_thread_time, last_thread_subject, last_thread_id } = (0, jquery_1._jqForumThreads)($);
        let pages = 0;
        let _a = $('#fd_page_top a.last[href*="page="]').eq(0);
        if (!_a.length) {
            _a = $('#fd_page_top .pg a[href*="page="]')
                .not('.nxt')
                .eq(-1);
        }
        if (_a.length) {
            pages = new lazy_url_1.default(_a.prop('href')).searchParams.get('page') | 0;
        }
        let page = $('#fd_page_top .pg :input[name="custompage"]').val() | 0;
        _a = $(`#forum_rules_${fid} > div`);
        let forum_rules;
        if (_a.length) {
            _a
                .find('[data-cfemail]')
                .removeAttr('data-cfemail');
            forum_rules = (0, util_1.trimUnsafe)((0, html_1.default)(_a.html()));
        }
        let moderator = {};
        _a = $(`div:has(> #forum_rules_${fid}) > div:eq(0)`);
        if (!_a.length) {
            _a = $(`.boardnav #ct .mn .bm .bm_c div`);
        }
        _a
            .find('a[href*="username="]')
            .each((i, elem) => {
            let _a = $(elem);
            let username = new lazy_url_1.default(_a.prop('href'))
                .searchParams.get('username');
            let name = _a.text();
            moderator[username] = name;
        });
        let stickthread = (0, jquery_1._jqForumStickThreads)($);
        return {
            fid,
            forum_name,
            last_thread_time,
            last_thread_id,
            last_thread_subject,
            pages,
            page,
            moderator,
            forum_rules,
            subforums,
            thread_types,
            stickthread,
            threads,
        };
    }
    forumThread(argv) {
        return this.forum(argv);
    }
    /**
     * 取得板塊下指定範圍頁數的主題列表
     */
    forumThreads(argv, range = {}) {
        let { from = 1, to = Infinity, delay, next } = range;
        from |= 0;
        delay |= 0;
        return this.forum({
            ...argv,
            page: from,
        })
            .then(async function (forum) {
            to = Math.min(to, forum.pages);
            if (forum.page > 0) {
                if (forum.page != from) {
                    throw new RangeError(`forum.page: ${forum.page} != from: ${from}`);
                }
                if (to < from) {
                    throw new RangeError(`to: ${to} < from: ${from}`);
                }
                let pi = from;
                let _not_cache;
                _not_cache = delay > 0 && !(0, lib_2.isResponseFromAxiosCache)(this.$response);
                let _updated;
                let data = forum;
                while (++pi <= to) {
                    if (next && !await next(data, forum)) {
                        _updated = true;
                        break;
                    }
                    if (_not_cache) {
                        await bluebird_1.default.delay(delay);
                    }
                    data = await this.forum({
                        ...argv,
                        page: pi,
                    })
                        .tap(function () {
                        _not_cache = delay > 0 && !(0, lib_2.isResponseFromAxiosCache)(this.$response);
                    });
                    forum.threads.push(...data.threads);
                    _updated = true;
                }
                delete forum.page;
                if (_updated) {
                    forum.threads = (0, uniqBy_1.default)(forum.threads, 'tid');
                }
            }
            return {
                pageFrom: from,
                pageTo: to,
                ...forum,
            };
        });
    }
    isLogin() {
        const jsdom = this.$returnValue;
        let username = (0, jquery_1._checkLoginUsername)(jsdom.$);
        if (username != null) {
            return bluebird_1.default.resolve(username);
        }
        return bluebird_1.default.resolve((0, jquery_1._checkLoginByJQuery)(jsdom.$));
    }
    hasCookiesAuth() {
        return this._jar()
            .findCookieByKey(/^.+_auth$/)
            .length > 0;
    }
    taskList() {
        let self = this;
        return this.taskListNew()
            .then(async (taskList) => {
            return {
                ...taskList,
                doing: await self.taskListDoing(),
            };
        });
    }
    taskListNew() {
        const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const { $ } = jsdom;
        let data = {
            disallow: [],
            allow: [],
        };
        $('#ct .ptm:eq(0) > table')
            .find('> tr, > tbody > tr')
            .each((i, elem) => {
            let _tr = $(elem);
            let _a = _tr.find('h3:eq(0) a:eq(0)');
            let task_name = _a.text();
            let task_id = new lazy_url_1.default(_a.prop('href')).searchParams.get('id');
            let task_desc = _tr
                .find('p.xg2:eq(0)')
                .text()
                .replace(/^[\n\r]+/g, '')
                .replace(/\s+$/g, '');
            let task_credit = _tr
                .find('> td:eq(-2)')
                .text()
                .replace(/^[\n\r]+/g, '')
                .replace(/\s+$/g, '');
            _a = _tr.find('> td:eq(-1) a[href*="do=apply"]').filter(`[href*="id=${task_id}"]`);
            let obj = {
                task_id,
                task_name,
                task_desc,
                task_credit,
            };
            data[(_a.length ? 'allow' : 'disallow')]
                .push(obj);
        });
        return data;
    }
    taskListDoing() {
        const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const { $ } = jsdom;
        const taskList = [];
        $('#ct .ptm:eq(0) > table')
            .find('> tr, > tbody > tr')
            .each((i, elem) => {
            let _tr = $(elem);
            let _a = _tr.find('h3:eq(0) a:eq(0)');
            let task_name = _a.text();
            let task_id = new lazy_url_1.default(_a.prop('href')).searchParams.get('id');
            let task_desc = _tr
                .find('p.xg2:eq(0)')
                .text()
                .replace(/^[\n\r]+/g, '')
                .replace(/\s+$/g, '');
            let task_credit = _tr
                .find('> td:eq(-2)')
                .text()
                .replace(/^[\n\r]+/g, '')
                .replace(/\s+$/g, '');
            _a = _tr.find('> td:eq(-1) a[href*="do=apply"]').filter(`[href*="id=${task_id}"]`);
            _a = _tr.find(`[href*="do=draw"]`);
            let task_drawable = !_a.find(`img[src*="rewardless.gif"]`).length && _a.find(`img[src*="reward.gif"]`).length > 0;
            let obj = {
                task_id,
                task_name,
                task_desc,
                task_credit,
                task_percent: _tr.find('.pbg.mtm.mbm .xs0')
                    .find(`#csc_${task_id}`)
                    .text(),
                task_drawable,
            };
            taskList
                .push(obj);
        });
        return taskList;
    }
    /**
     * auto apply new task list and draw it
     */
    doAutoTaskList(cb) {
        return this.taskListNew()
            .tap((ls) => cb === null || cb === void 0 ? void 0 : cb('taskListNew', ls))
            .then(ls => ls.allow)
            .mapSeries(task => this.taskApply(task.task_id).tap((r) => cb === null || cb === void 0 ? void 0 : cb('taskApply', r)))
            .then(() => this.taskListDoing())
            .tap((r) => cb === null || cb === void 0 ? void 0 : cb('taskListDoing', r))
            .mapSeries(task => task.task_drawable && this.taskDraw(task.task_id).tap((r) => cb === null || cb === void 0 ? void 0 : cb('taskDraw', r)));
    }
    taskApply(task_id) {
        return;
    }
    taskDraw(task_id) {
        return;
    }
    taskDelete(task_id) {
        return;
    }
    noticeView(view = 'system') {
        return;
    }
    thread(thread_options2) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let thread_options = {
            ...thread_options2,
        };
        // @ts-ignore
        delete thread_options.tid;
        if (!thread_options.extra) {
            delete thread_options.extra;
        }
        if (!thread_options.authorid == null) {
            delete thread_options.authorid;
        }
        if (!thread_options.ordertype) {
            delete thread_options.ordertype;
        }
        let tid = thread_options2.tid.toString();
        let postlist = $('#ct #postlist');
        let subject;
        postlist.find('#thread_subject')
            .each((i, elem) => {
            let text = $(elem).text();
            if (text != '') {
                text = (0, util_1.trimUnsafe)(text);
                if (text != '') {
                    subject = text;
                }
            }
        });
        let posts = [];
        let thread_attach = {};
        let pgt = $('#ct #pgt .pg');
        let page = pgt.find(':input[name="custompage"]').val() | 0;
        let pages;
        let _a = pgt.find('a.last');
        if (!_a.length) {
            _a = pgt.find('a + label').prev('a');
        }
        if (_a.length) {
            pages = _a.text() | 0;
        }
        let threadView = {
            tid,
            subject,
            author: undefined,
            authorid: undefined,
            thread_options,
            pages,
            page,
            posts,
            thread_attach,
            post_pay: undefined,
        };
        if (page > 1) {
            let _a = $('#tath a[href*="uid="]')
                .not(':has(img)')
                .eq(0);
            if (_a.length) {
                threadView.authorid = new lazy_url_1.default(_a.prop('href'))
                    .searchParams
                    .get('uid');
                threadView.author = (0, util_1.trimUnsafe)(_a.text());
            }
        }
        postlist
            .find('> div[id^="post_"]')
            .each((i, elem) => {
            let post = $(elem);
            let pid = post.prop('id')
                .replace(/^post_/, '');
            let author;
            let authorid;
            let _a = post.find(`#favatar${pid} .authi a[href*="uid="]:eq(0)`);
            if (_a.length) {
                author = _a.text();
                authorid = new lazy_url_1.default(_a.prop('href'))
                    .searchParams
                    .get('uid');
            }
            let _postmessage = post.find(`#postmessage_${pid}`);
            let postmessage;
            let last_edit;
            let attach;
            let post_pay;
            if (post.find('.viewpay').length) {
                post_pay = {
                    exixts: true,
                };
                if (!threadView.post_pay) {
                    threadView.post_pay = {
                        ...post_pay,
                    };
                }
                else {
                    threadView.post_pay.exixts = true;
                }
            }
            if (_postmessage.length) {
                let pstatus = _postmessage
                    .find('> .pstatus:eq(0)')
                    .remove();
                ;
                if (pstatus.length && pstatus.text().match(/(\d+-\d+-\d+(?:\s+\d+:\d+(?::\d+)?))/)) {
                    last_edit = (0, moment_1.default)(RegExp.$1, 'YYYY-MM-DD HH:mm:ss').unix();
                }
                _postmessage
                    .find('ignore_js_op:has(img[id^="aimg_"][aid])')
                    .each((i, elem) => {
                    let ignore_js_op = $(elem);
                    let item = ignore_js_op
                        .find('img[id^="aimg_"][aid]');
                    let aid = item.prop('id')
                        .replace(/^aimg_/, '');
                    let file = item.attr('file');
                    attach = attach || {};
                    attach.img = attach.img || [];
                    attach.img.push({
                        aid,
                        file,
                    });
                    ignore_js_op.after(`(插圖aid_${aid})`);
                    ignore_js_op.remove();
                });
                if (attach && attach.img && attach.img.length) {
                    thread_attach = thread_attach || {};
                    thread_attach.img = thread_attach.img || [];
                    thread_attach.img.push(...attach.img);
                }
                postmessage = (0, crlf_normalize_1.default)(_postmessage.text())
                    .replace(/^\n+|\s+$/g, '');
            }
            let dateline;
            let _authorposton = post
                .find(`#authorposton${pid}`);
            let _m = _authorposton
                .text()
                .match(/(\d+-\d+-\d+(?:\s+\d+:\d+(?::\d+)?))/);
            if (_m) {
                dateline = (0, moment_1.default)(_m[1], 'YYYY-MM-DD HH:mm:ss').unix();
            }
            _a = _authorposton.find('[title]');
            if (!dateline && _a.length) {
                dateline = (0, moment_1.default)(_a.attr('title'), 'YYYY-MM-DD HH:mm:ss').unix();
            }
            if (page == 1) {
                threadView.author = author;
                threadView.authorid = authorid;
            }
            posts.push({
                pid,
                author,
                authorid,
                dateline,
                last_edit,
                [types_1.SymDzPost]: post,
                postmessage,
                attach,
                post_pay,
            });
        });
        thread_attach.img = (0, uniqBy_1.default)(thread_attach.img, 'aid');
        threadView.thread_attach = thread_attach;
        return threadView;
    }
    threadPosts(thread_options2, range = {}) {
        let { from = 1, to = Infinity, delay } = range;
        from |= 0;
        return this.thread({
            ...thread_options2,
            page: from,
        })
            .then(async function (thread) {
            from = thread.page;
            to = Math.min(to, thread.pages | 0);
            if (thread.page > 0) {
                if (thread.page != from) {
                    throw new RangeError(`forum.page: ${thread.page} != from: ${from}`);
                }
                if (to < from) {
                    throw new RangeError(`to: ${to} < from: ${from}`);
                }
                let pi = from;
                let _not_cache;
                _not_cache = delay > 0 && !(0, lib_2.isResponseFromAxiosCache)(this.$response);
                let _updated;
                while (++pi <= to) {
                    if (_not_cache) {
                        await bluebird_1.default.delay(delay);
                    }
                    let data = await this.thread({
                        ...thread_options2,
                        page: pi,
                    })
                        .tap(function () {
                        _not_cache = delay > 0 && !(0, lib_2.isResponseFromAxiosCache)(this.$response);
                    });
                    thread.posts.push(...data.posts);
                    if (data.thread_attach.img) {
                        thread.thread_attach.img = thread.thread_attach.img || [];
                        thread.thread_attach.img.push(...data.thread_attach.img);
                    }
                    _updated = true;
                }
                delete thread.page;
                if (_updated) {
                    thread.posts = (0, uniqBy_1.default)(thread.posts, 'pid');
                    if (thread.thread_attach.img) {
                        thread.thread_attach.img = (0, uniqBy_1.default)(thread.thread_attach.img, 'aid');
                    }
                }
            }
            return {
                ...thread,
                pageFrom: from,
                pageTo: to,
            };
        });
    }
    jsInfo() {
        const jsdom = this.$returnValue;
        let { charset, cookiepre, SITEURL } = jsdom.window;
        return bluebird_1.default.resolve({
            var: {
                charset, cookiepre, SITEURL,
            },
            jsdom,
        });
    }
    _createJSDOM(html, config) {
        return super._createJSDOM(html, config);
    }
};
tslib_1.__decorate([
    (0, decorators_1.POST)('member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)({
        disableFallbackReturnValue: true,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)({
        cookietime: 315360000,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "loginByForm", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('forum.php?mod=forumdisplay&fid={fid}'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)({
        filter: 'dateline',
        orderby: 'dateline',
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "forum", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('home.php?mod=space&do=notice&view=system'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "isLogin", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('home.php?mod=task'),
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "taskListNew", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('home.php?mod=task&item=doing'),
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "taskListDoing", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('home.php?mod=task&do=apply&id={task_id}'),
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('task_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "taskApply", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('home.php?mod=task&do=draw&id={task_id}'),
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('task_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "taskDraw", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('home.php?mod=task&do=delete&id={task_id}'),
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('task_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "taskDelete", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('home.php?mod=space&do=notice&view={view}'),
    (0, decorators_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('view', 'system')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "noticeView", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('forum.php?mod=viewthread&tid={tid}'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)({
        ordertype: 0,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DiscuzClient.prototype, "thread", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('forum.php'),
    (0, jsdom_1.ReturnValueToJSDOM)({
        runScripts: 'dangerously',
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], DiscuzClient.prototype, "jsInfo", null);
exports.DiscuzClient = DiscuzClient = tslib_1.__decorate([
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
            exclude: {
                query: false,
            }
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], DiscuzClient);
exports.default = DiscuzClient;
//# sourceMappingURL=index.js.map