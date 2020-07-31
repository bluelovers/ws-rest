"use strict";
/**
 * Created by user on 2019/6/13.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchResponseDataError = void 0;
const decorators_1 = require("restful-decorator/lib/decorators");
const error_1 = require("restful-decorator/lib/wrap/error");
const bluebird_1 = __importDefault(require("bluebird"));
function CatchResponseDataError(fn) {
    return decorators_1.CatchError(async function (e) {
        e = error_1.mergeAxiosErrorWithResponseData(e);
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
exports.CatchResponseDataError = CatchResponseDataError;
//# sourceMappingURL=decorators.js.map