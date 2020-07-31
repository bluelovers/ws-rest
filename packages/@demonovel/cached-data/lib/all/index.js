"use strict";
/**
 * Created by user on 2020/3/2.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const demonovel_1 = __importDefault(require("../demonovel"));
const sites_1 = __importDefault(require("../sites"));
const bluebird_1 = __importDefault(require("bluebird"));
function fetchFileAll(force, opts) {
    return bluebird_1.default.props({
        a: sites_1.default(force, opts),
        b: demonovel_1.default(force),
    })
        .then(async (data) => {
        return {
            ...data.a,
            ...data.b,
        };
    });
}
exports.default = fetchFileAll;
//# sourceMappingURL=index.js.map