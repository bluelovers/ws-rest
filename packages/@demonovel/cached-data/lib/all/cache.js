"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCached = void 0;
const title_1 = __importDefault(require("./cache/title"));
const bluebird_1 = __importDefault(require("bluebird"));
const stat_1 = __importDefault(require("./cache/stat"));
const byDate_1 = __importDefault(require("./cache/byDate"));
const author_1 = __importDefault(require("./cache/author"));
async function buildCached(list) {
    return bluebird_1.default.all([
        title_1.default(list),
        stat_1.default(list),
        byDate_1.default(list),
        author_1.default(list),
    ]);
}
exports.buildCached = buildCached;
exports.default = buildCached;
//# sourceMappingURL=cache.js.map