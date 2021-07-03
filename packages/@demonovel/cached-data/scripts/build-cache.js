"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __root_1 = require("../lib/__root");
const cache_1 = (0, tslib_1.__importDefault)(require("../lib/all/cache"));
exports.default = (0, fs_extra_1.readJSON)((0, path_1.join)(__root_1.__rootCache, `pack`, `array.json`))
    .then(list => {
    return (0, cache_1.default)(list);
});
//# sourceMappingURL=build-cache.js.map