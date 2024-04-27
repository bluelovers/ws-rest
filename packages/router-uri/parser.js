"use strict";
/**
 * Created by user on 2019/6/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRouterVars = parseRouterVars;
exports.expand = expand;
const tslib_1 = require("tslib");
const execall2_1 = tslib_1.__importDefault(require("execall2"));
// @ts-ignore
const uri_template_lite_1 = tslib_1.__importDefault(require("uri-template-lite"));
/**
 * @see uri-template-lite
 */
const expandRe = /\{([#&+.\/;?]?)((?:[\w%.]+(\*|:\d+)?,?)+)\}/g;
function parseRouterVars(url) {
    return (0, execall2_1.default)(expandRe, url)
        .map((row) => {
        return row.sub[1];
    });
}
function expand(url, data) {
    let ks = parseRouterVars(url);
    let ret = ks.reduce((a, k) => {
        if (ks.includes(k)) {
            // @ts-ignore
            a.paths[k] = data[k];
        }
        else {
            // @ts-ignore
            a.data[k] = data[k];
        }
        return a;
    }, {
        paths: {},
        data: {},
    });
    return {
        router: url,
        url: new uri_template_lite_1.default(url).expand(data),
        ...ret,
    };
}
exports.default = parseRouterVars;
//# sourceMappingURL=parser.js.map