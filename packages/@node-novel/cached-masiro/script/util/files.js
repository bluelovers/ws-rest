"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheFileInfoPath = exports.__root = exports.cacheFilePaths = exports.__path = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const files_1 = require("@node-novel/site-cache-util/lib/files");
exports.__path = (0, files_1.createPkgCachePath)(path_1.default.join(__dirname, '..', '..'), {
    map: {
        infoPack: ['data', 'forum.pack.json'],
        subforums: ['data', 'subforums.json'],
        topforums: ['data', 'topforums.json'],
        dirFid: ['data', 'fid'],
    },
    fn: {
        cacheFileInfoPath(id) {
            return this.join('data', 'fid', `${id}.json`);
        },
    }
});
exports.cacheFilePaths = exports.__path.cacheFilePaths, exports.__root = exports.__path.__root;
exports.cacheFileInfoPath = exports.__path.fn.cacheFileInfoPath;
exports.default = exports.cacheFilePaths;
//# sourceMappingURL=files.js.map