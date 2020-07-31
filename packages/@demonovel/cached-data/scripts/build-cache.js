"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __root_1 = require("../lib/__root");
const cache_1 = __importDefault(require("../lib/all/cache"));
exports.default = fs_extra_1.readJSON(path_1.join(__root_1.__rootCache, `pack`, `array.json`))
    .then(list => {
    return cache_1.default(list);
});
//# sourceMappingURL=build-cache.js.map