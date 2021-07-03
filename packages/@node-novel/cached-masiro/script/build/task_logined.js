"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
/**
 * Created by user on 2019/12/16.
 */
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    if (!await api.hasCookiesAuth()) {
        return;
    }
    await api.doAutoTaskList(((eventName, data) => {
        util_1.consoleDebug.log(`[${eventName}]`, data);
    }));
    /*
    await api.taskList()
        .then(data => {

            consoleDebug.dir(data);

            return data.allow.concat(data.doing)
        })
        .mapSeries(task => {
            return api
                .taskApply(task.task_id)
                .tap(e => {
                    consoleDebug.debug(`[task]`, task);
                })
                ;
        })
    ;
     */
    await api.noticeView('system');
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=task_logined.js.map