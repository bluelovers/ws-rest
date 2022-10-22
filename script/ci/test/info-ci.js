"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/1/10.
 */
const index_1 = require("@node-novel/site-cache-util/lib/index");
const env_ci_1 = tslib_1.__importDefault(require("env-ci"));
const project_root_1 = require("../../project-root");
const cross_ci_1 = tslib_1.__importDefault(require("cross-ci"));
exports.default = (0, index_1.lazyRun)(async () => {
    index_1.console.cyan.log('env-ci');
    index_1.console.dir((0, env_ci_1.default)({
        cwd: project_root_1.__rootWs,
    }));
    index_1.console.cyan.log('cross-ci');
    let vls = {
        ...cross_ci_1.default.vars,
    };
    Object.keys(vls)
        .forEach((k) => {
        if (/token/i.test(k)) {
            // @ts-ignore
            vls[k] = `***(${k in vls}, ${(vls[k] != null) && vls[k].length})***`;
        }
    });
    index_1.console.dir(vls);
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=info-ci.js.map