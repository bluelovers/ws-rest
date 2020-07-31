"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__rootCacheBuild = exports.__rootCacheSource = exports.__rootCache = exports.__root = void 0;
const path_1 = require("path");
exports.__root = path_1.join(__dirname, '..');
exports.__rootCache = path_1.join(exports.__root, 'cache');
exports.__rootCacheSource = path_1.join(exports.__rootCache, 'source');
exports.__rootCacheBuild = path_1.join(exports.__rootCache, 'build');
//# sourceMappingURL=__root.js.map