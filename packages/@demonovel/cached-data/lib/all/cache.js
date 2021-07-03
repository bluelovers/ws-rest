"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCached = void 0;
const tslib_1 = require("tslib");
const title_1 = (0, tslib_1.__importDefault)(require("./cache/title"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const stat_1 = (0, tslib_1.__importDefault)(require("./cache/stat"));
const byDate_1 = (0, tslib_1.__importDefault)(require("./cache/byDate"));
const author_1 = (0, tslib_1.__importDefault)(require("./cache/author"));
async function buildCached(list) {
    return bluebird_1.default.all([
        (0, title_1.default)(list),
        (0, stat_1.default)(list),
        (0, byDate_1.default)(list),
        (0, author_1.default)(list),
    ]);
}
exports.buildCached = buildCached;
exports.default = buildCached;
//# sourceMappingURL=cache.js.map