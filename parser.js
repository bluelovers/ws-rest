"use strict";
/**
 * Created by user on 2019/6/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.expand = exports.parseRouterVars = void 0;
const tslib_1 = require("tslib");
const execall2_1 = (0, tslib_1.__importDefault)(require("execall2"));
// @ts-ignore
const uri_template_lite_1 = require("uri-template-lite");
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
exports.parseRouterVars = parseRouterVars;
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
        url: new uri_template_lite_1.URI.Template(url).expand(data),
        ...ret,
    };
}
exports.expand = expand;
exports.default = parseRouterVars;
//# sourceMappingURL=parser.js.map