"use strict";
/**
 * Created by user on 2019/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchResponseDataError = CatchResponseDataError;
const tslib_1 = require("tslib");
const decorators_1 = require("restful-decorator/lib/decorators");
const error_1 = require("restful-decorator/lib/wrap/error");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
function CatchResponseDataError(fn) {
    return (0, decorators_1.CatchError)(async function (e) {
        e = (0, error_1.mergeAxiosErrorWithResponseData)(e);
        let ret;
        if (fn) {
            ret = await fn(e.response.data, e);
        }
        if (ret != null) {
            return bluebird_1.default.reject(ret);
        }
        return bluebird_1.default.reject(e);
    });
}
//# sourceMappingURL=decorators.js.map