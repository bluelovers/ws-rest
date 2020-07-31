"use strict";
/**
 * Created by user on 2020/5/4.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const bluebird_1 = __importDefault(require("bluebird"));
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = index_1.lazyRun(async () => {
    await bluebird_1.default.resolve().tap(e => dotenv_1.config()).catch(e => null);
    await axios_1.default
        .get(process.env.NOW_DEPLOY_HOOK)
        .then(response => {
        console.dir(response.data);
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=novel-opds-now.js.map