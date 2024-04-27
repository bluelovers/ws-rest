"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputJSONOptions = void 0;
exports.outputJSONLazy = outputJSONLazy;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
exports.outputJSONOptions = {
    spaces: 2,
};
function outputJSONLazy(file, data, options) {
    if (!options) {
        options = exports.outputJSONOptions;
    }
    return bluebird_1.default.resolve((0, fs_extra_1.outputJSON)(file, data, options));
}
//# sourceMappingURL=fs.js.map