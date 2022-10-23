"use strict";
/**
 * Created by user on 2020/1/19.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = tslib_1.__importDefault(require("discuz-api/lib/index"));
const index_2 = tslib_1.__importDefault(require("phpwind-api/lib/index"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const dotenv_1 = require("dotenv");
const util_1 = require("@node-novel/cached-masiro/script/util");
const index_3 = require("@node-novel/site-cache-util/lib/index");
exports.default = (0, index_3.lazyRun)(async () => {
    await bluebird_1.default.resolve().tap(e => (0, dotenv_1.config)()).catch(e => null);
    //consoleDebug.info(`執行 discuz 模組`);
    await bluebird_1.default.resolve(process.env['MY_HASHED_JSON'])
        .then((envValue) => {
        return JSON.parse(Buffer.from(envValue, 'base64').toString()) || [];
    })
        .catch(e => [])
        .tap(ls => util_1.consoleDebug.info(`list count:`, ls.length))
        .each(async (options) => {
        var _b;
        let { baseURL, cookies, siteType } = options;
        if (/lightnovel/.test(baseURL)) {
            return;
        }
        util_1.consoleDebug.info(siteType, baseURL);
        const api = new (siteType === 'phpwind' ? index_2.default : index_1.default)({
            baseURL,
        });
        // @ts-ignore
        api.loginByCookiesSync(cookies);
        await api.doAutoTaskList(((eventName, data) => {
            util_1.consoleDebug.log(`[${eventName}]`, data);
        }));
        /*
        await api.taskList()
            .then(data => {

                consoleDebug.dir(data);

                return data.allow
            })
            .mapSeries(task => {
                return api
                    .taskApply(task.task_id)
                    .tap(e => {
                        consoleDebug.debug(`[task]`, task);
                    })
                    ;
            })

         */
        ;
        await api.isLogin()
            .tap(bool => console.log(`isLogin`, !!bool))
            .tap(async function () {
            const jsdom = this.$returnValue;
            const { $ } = jsdom;
            let _a = $('#my_amupper');
            if (_a.length) {
                let href = _a.attr('onclick').match(/ajaxget\('([^\']+)'/)[1];
                //console.dir(href);
                await bluebird_1.default.resolve(api.$http.get(href))
                    //.tap(v => console.log(typeof v, v, v.toString()))
                    .catch(e => null);
                return api.isLogin();
            }
        })
            .catch(e => null);
        // @ts-ignore
        await ((_b = api.noticeView) === null || _b === void 0 ? void 0 : _b.call(api, 'app'));
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=index.js.map