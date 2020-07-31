"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteIDCachedSourceFile = void 0;
const path_1 = require("path");
const __root_1 = require("../__root");
function siteIDCachedSourceFile(siteID) {
    let file = path_1.join(__root_1.__rootCacheSource, `./${siteID}.json`);
    return file;
}
exports.siteIDCachedSourceFile = siteIDCachedSourceFile;
//# sourceMappingURL=files.js.map