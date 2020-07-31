"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUUID = exports.trim = void 0;
const lib_1 = require("zero-width/lib");
const uuid_1 = require("uuid");
function trim(input) {
    return lib_1.removeZeroWidth(lib_1.nbspToSpace(input))
        .replace(/^[\s　\u00A0]+|[\s　\u00A0]+$/g, '');
}
exports.trim = trim;
function newUUID(siteID, id) {
    let seed = siteID + '#' + id;
    //return hashSum(seed)
    return uuid_1.v5(seed, uuid_1.v5.URL);
}
exports.newUUID = newUUID;
//# sourceMappingURL=util.js.map