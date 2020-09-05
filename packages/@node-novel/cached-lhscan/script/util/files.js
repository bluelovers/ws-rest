"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheFileInfoPath = exports.__root = exports.cacheFilePaths = exports.__path = void 0;
const path_1 = __importDefault(require("path"));
const files_1 = require("@node-novel/site-cache-util/lib/files");
exports.__path = files_1.createPkgCachePath(path_1.default.join(__dirname, '..', '..'), {
    fn: {
        cacheFileInfoPath(id) {
            return this.join('data', `info/${id}.json`);
        }
    }
});
exports.cacheFilePaths = exports.__path.cacheFilePaths, exports.__root = exports.__path.__root;
exports.cacheFileInfoPath = exports.__path.fn.cacheFileInfoPath;
exports.default = exports.cacheFilePaths;
//# sourceMappingURL=files.js.map