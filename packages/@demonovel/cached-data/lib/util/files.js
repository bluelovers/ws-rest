"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteIDCachedSourceFile = siteIDCachedSourceFile;
const path_1 = require("path");
const __root_1 = require("../__root");
function siteIDCachedSourceFile(siteID) {
    let file = (0, path_1.join)(__root_1.__rootCacheSource, `./${siteID}.json`);
    return file;
}
//# sourceMappingURL=files.js.map