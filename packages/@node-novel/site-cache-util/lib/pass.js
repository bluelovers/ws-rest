"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPassword = void 0;
const tslib_1 = require("tslib");
const index_1 = require("./index");
const env_bool_1 = tslib_1.__importDefault(require("env-bool"));
async function importPassword(options) {
    let target = index_1.path.resolve(options.__root, options.file);
    return (_a = target, Promise.resolve().then(() => tslib_1.__importStar(require(_a)))).catch(e => {
        let { envPrefix } = options;
        if (envPrefix) {
            envPrefix = envPrefix.toUpperCase();
            let username = process.env[`${envPrefix}_USER`];
            let password = process.env[`${envPrefix}_PASS`];
            let DISABLE_LOGIN = (0, env_bool_1.default)(process.env[`${envPrefix}_DISABLE_LOGIN`]);
            if (username && password) {
                return {
                    DISABLE_LOGIN,
                    default: {
                        username,
                        password,
                    }
                };
            }
        }
        index_1.console.red.info(`importPassword:failed`, target);
        return {};
    });
}
exports.importPassword = importPassword;
exports.default = importPassword;
//# sourceMappingURL=pass.js.map