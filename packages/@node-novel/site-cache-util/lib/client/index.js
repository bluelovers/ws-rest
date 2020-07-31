"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getApiClient = exports._setupCacheFile = void 0;
const save_1 = require("./save");
Object.defineProperty(exports, "_setupCacheFile", { enumerable: true, get: function () { return save_1._setupCacheFile; } });
const main_1 = require("./main");
Object.defineProperty(exports, "_getApiClient", { enumerable: true, get: function () { return main_1._getApiClient; } });
exports.default = {
    _setupCacheFile: save_1._setupCacheFile,
    _getApiClient: main_1._getApiClient,
};
//# sourceMappingURL=index.js.map