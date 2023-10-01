"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPWindClient = void 0;
const tslib_1 = require("tslib");
const cache_1 = require("restful-decorator/lib/decorators/config/cache");
const lib_1 = tslib_1.__importDefault(require("restful-decorator-plugin-jsdom/lib"));
const method_1 = require("restful-decorator/lib/decorators/method");
const form_1 = require("restful-decorator/lib/decorators/form");
const abstract_1 = require("restful-decorator/lib/wrap/abstract");
const body_1 = require("restful-decorator/lib/decorators/body");
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const _checkLogin_1 = require("./util/jquery/_checkLogin");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const _task_info_1 = require("./util/jquery/_task_info");
const config_1 = require("restful-decorator/lib/decorators/config");
/**
 * Created by user on 2020/5/13.
 */
let PHPWindClient = class PHPWindClient extends lib_1.default {
    constructor(...argv) {
        let [defaults = {}] = argv;
        if (!defaults.baseURL) {
            throw new TypeError(`baseURL must set`);
        }
        argv[0] = defaults;
        super(...argv);
    }
    loginByForm(inputData) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        this._updateVerifyHash(jsdom);
        let username = (0, _checkLogin_1._checkLoginUsername)(jsdom.$);
        if (username != null) {
            return bluebird_1.default.resolve(username);
        }
        return this.isLogin()
            .then(bool => {
            if (!bool) {
                return Promise.reject(bool);
            }
            return bool;
        });
    }
    isLogin() {
        const jsdom = this.$returnValue;
        this._updateVerifyHash(jsdom);
        let username = (0, _checkLogin_1._checkLoginUsername)(jsdom.$);
        if (username != null) {
            return bluebird_1.default.resolve(username);
        }
        return bluebird_1.default.resolve((0, _checkLogin_1._checkLoginByJQuery)(jsdom.$));
    }
    _getAuthCookies() {
        let cr = /_(?:winduser)$/;
        let ret = this._jar()
            .findCookieByKey(cr, this.$baseURL)
            .reduce((a, b) => {
            let _m = cr.exec(b.key);
            // @ts-ignore
            a[_m[1]] = b;
            return a;
        }, {});
        return ret;
    }
    hasCookiesAuth() {
        return this._jar()
            .findCookieByKey(/_(?:winduser)$/)
            .length > 0;
    }
    _updateVerifyHash(jsdom) {
        var _a;
        if (typeof jsdom === 'string') {
            this._verifyhash = jsdom;
        }
        else if ((_a = jsdom === null || jsdom === void 0 ? void 0 : jsdom.window) === null || _a === void 0 ? void 0 : _a['verifyhash']) {
            this._verifyhash = jsdom.window['verifyhash'];
        }
        return this._verifyhash;
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
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        const verifyhash = this._updateVerifyHash(jsdom);
        let data = {
            disallow: [],
            allow: [],
        };
        $('#main div > table:has(.f_one)')
            .find('.f_one')
            .each((i, elem) => {
            let _tr = $(elem);
            let obj = (0, _task_info_1._parseTaskInfo)($, _tr);
            if (!obj) {
                return;
            }
            delete obj.task_percent;
            delete obj.task_drawable;
            data[(obj.task_id ? 'allow' : 'disallow')]
                .push(obj);
        });
        return data;
    }
    taskListDoing() {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        const verifyhash = this._updateVerifyHash(jsdom);
        const taskList = [];
        $('#main div > table:has(.f_one)')
            .find('.f_one')
            .each((i, elem) => {
            let _tr = $(elem);
            let obj = (0, _task_info_1._parseTaskInfo)($, _tr);
            if (!obj) {
                return;
            }
            taskList
                .push(obj);
        });
        return taskList;
    }
    taskApply(task_id, extra = {
        nowtime: Date.now(),
        verify: this._updateVerifyHash(),
    }) {
        return;
    }
    taskDraw(task_id, extra = {
        nowtime: Date.now(),
        verify: this._updateVerifyHash(),
    }) {
        return;
    }
    doAutoTaskList(cb) {
        return this.taskListNew()
            .tap((ls) => cb === null || cb === void 0 ? void 0 : cb('taskListNew', ls))
            .then(ls => ls.allow)
            .mapSeries(task => this.taskApply(task.task_id).tap((r) => cb === null || cb === void 0 ? void 0 : cb('taskApply', r)))
            .then(() => this.taskListDoing())
            .tap((r) => cb === null || cb === void 0 ? void 0 : cb('taskListDoing', r))
            .mapSeries(task => task.task_drawable && this.taskDraw(task.task_id).tap((r) => cb === null || cb === void 0 ? void 0 : cb('taskDraw', r)));
    }
};
exports.PHPWindClient = PHPWindClient;
tslib_1.__decorate([
    (0, method_1.POST)('login.php?submit=login'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    form_1.FormUrlencoded,
    (0, config_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    })
    // @ts-ignore
    ,
    (0, abstract_1.methodBuilder)(function (info) {
        const inputData = info.argv[0];
        let data = info.requestConfig.data;
        data.cktime = inputData.cookietime || 31536000;
        data.jumpurl = this.$baseURL;
        data.step = 2;
        data.pwuser = inputData.username;
        data.pwpwd = inputData.password;
        data.forward = '';
        return info;
    }, {
        disableFallbackReturnValue: true,
    }),
    tslib_1.__param(0, (0, body_1.ParamMapAuto)({
        cookietime: 315360000,
        lgt: 0,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], PHPWindClient.prototype, "loginByForm", null);
tslib_1.__decorate([
    (0, method_1.GET)('message.php'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, config_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], PHPWindClient.prototype, "isLogin", null);
tslib_1.__decorate([
    (0, method_1.GET)('plugin.php?H_name-tasks.html'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, config_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskListNew", null);
tslib_1.__decorate([
    (0, method_1.GET)('plugin.php?H_name-tasks-actions-newtasks.html'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, config_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskListDoing", null);
tslib_1.__decorate([
    (0, method_1.GET)('plugin.php?H_name=tasks&action=ajax&actions=job&cid={task_id}&nowtime={nowtime}&verify={verify}'),
    (0, config_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__param(0, (0, body_1.ParamPath)('task_id')),
    tslib_1.__param(1, (0, body_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskApply", null);
tslib_1.__decorate([
    (0, method_1.GET)('plugin.php?H_name=tasks&action=ajax&actions=job2&cid={task_id}&nowtime={nowtime}&verify={verify}'),
    (0, config_1.RequestConfigs)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__param(0, (0, body_1.ParamPath)('task_id')),
    tslib_1.__param(1, (0, body_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskDraw", null);
exports.PHPWindClient = PHPWindClient = tslib_1.__decorate([
    (0, cache_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
            exclude: {
                query: false,
            }
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], PHPWindClient);
exports.default = PHPWindClient;
//# sourceMappingURL=index.js.map