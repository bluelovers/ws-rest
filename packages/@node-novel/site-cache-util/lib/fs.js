"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputJSONLazy = exports.outputJSONOptions = void 0;
const fs_extra_1 = require("fs-extra");
const bluebird_1 = __importDefault(require("bluebird"));
exports.outputJSONOptions = {
    spaces: 2,
};
function outputJSONLazy(file, data, options) {
    if (!options) {
        options = exports.outputJSONOptions;
    }
    return bluebird_1.default.resolve(fs_extra_1.outputJSON(file, data, options));
}
exports.outputJSONLazy = outputJSONLazy;
//# sourceMappingURL=fs.js.map