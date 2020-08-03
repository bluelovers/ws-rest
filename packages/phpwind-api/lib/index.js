"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPWindClient = void 0;
const cache_1 = require("restful-decorator/lib/decorators/config/cache");
const lib_1 = __importDefault(require("restful-decorator-plugin-jsdom/lib"));
const method_1 = require("restful-decorator/lib/decorators/method");
const form_1 = require("restful-decorator/lib/decorators/form");
const abstract_1 = require("restful-decorator/lib/wrap/abstract");
const body_1 = require("restful-decorator/lib/decorators/body");
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const _checkLogin_1 = require("./util/jquery/_checkLogin");
const bluebird_1 = __importDefault(require("bluebird"));
const _task_info_1 = require("./util/jquery/_task_info");
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
        let username = _checkLogin_1._checkLoginUsername(jsdom.$);
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
        let username = _checkLogin_1._checkLoginUsername(jsdom.$);
        if (username != null) {
            return bluebird_1.default.resolve(username);
        }
        return bluebird_1.default.resolve(_checkLogin_1._checkLoginByJQuery(jsdom.$));
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
        else if ((_a = jsdom === null || jsdom === void 0 ? void 0 : jsdom.window) === null || _a === void 0 ? void 0 : _a.verifyhash) {
            this._verifyhash = jsdom.window.verifyhash;
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
            let obj = _task_info_1._parseTaskInfo($, _tr);
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
            let obj = _task_info_1._parseTaskInfo($, _tr);
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
__decorate([
    method_1.POST('login.php?submit=login'),
    jsdom_1.ReturnValueToJSDOM(),
    form_1.FormUrlencoded,
    cache_1.CacheRequest({
        cache: {
            maxAge: 0,
        },
    })
    // @ts-ignore
    ,
    abstract_1.methodBuilder(function (info) {
        const inputData = info.argv[0];
        let data = info.requestConfig.data;
        data.cktime = inputData.cookietime || 31536000;
        data.jumpurl = this.$baseURL;
        data.step = 2;
        data.pwuser = inputData.username;
        data.pwpwd = inputData.password;
        data.forward = '';
        return info;
    }),
    __param(0, body_1.ParamMapAuto({
        cookietime: 315360000,
        lgt: 0,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PHPWindClient.prototype, "loginByForm", null);
__decorate([
    method_1.GET('message.php'),
    jsdom_1.ReturnValueToJSDOM(),
    cache_1.CacheRequest({
        cache: {
            maxAge: 0,
        },
    }),
    abstract_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], PHPWindClient.prototype, "isLogin", null);
__decorate([
    method_1.GET('plugin.php?H_name-tasks.html'),
    jsdom_1.ReturnValueToJSDOM(),
    cache_1.CacheRequest({
        cache: {
            maxAge: 0,
        },
    }),
    abstract_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskListNew", null);
__decorate([
    method_1.GET('plugin.php?H_name-tasks-actions-newtasks.html'),
    jsdom_1.ReturnValueToJSDOM(),
    cache_1.CacheRequest({
        cache: {
            maxAge: 0,
        },
    }),
    abstract_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskListDoing", null);
__decorate([
    method_1.GET('plugin.php?H_name=tasks&action=ajax&actions=job&cid={task_id}&nowtime={nowtime}&verify={verify}'),
    cache_1.CacheRequest({
        cache: {
            maxAge: 0,
        },
    }),
    abstract_1.methodBuilder(),
    __param(0, body_1.ParamPath('task_id')), __param(1, body_1.ParamMapAuto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskApply", null);
__decorate([
    method_1.GET('plugin.php?H_name=tasks&action=ajax&actions=job2&cid={task_id}&nowtime={nowtime}&verify={verify}'),
    cache_1.CacheRequest({
        cache: {
            maxAge: 0,
        },
    }),
    abstract_1.methodBuilder(),
    __param(0, body_1.ParamPath('task_id')), __param(1, body_1.ParamMapAuto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], PHPWindClient.prototype, "taskDraw", null);
PHPWindClient = __decorate([
    cache_1.CacheRequest({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
        },
    }),
    __metadata("design:paramtypes", [Object])
], PHPWindClient);
exports.PHPWindClient = PHPWindClient;
exports.default = PHPWindClient;
//# sourceMappingURL=index.js.map