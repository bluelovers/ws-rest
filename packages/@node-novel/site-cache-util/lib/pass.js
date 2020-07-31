"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPassword = void 0;
const index_1 = require("./index");
const env_bool_1 = __importDefault(require("env-bool"));
async function importPassword(options) {
    let target = index_1.path.resolve(options.__root, options.file);
    return Promise.resolve().then(() => __importStar(require(target))).catch(e => {
        let { envPrefix } = options;
        if (envPrefix) {
            envPrefix = envPrefix.toUpperCase();
            let username = process.env[`${envPrefix}_USER`];
            let password = process.env[`${envPrefix}_PASS`];
            let DISABLE_LOGIN = env_bool_1.default(process.env[`${envPrefix}_DISABLE_LOGIN`]);
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