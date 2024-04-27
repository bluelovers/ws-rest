"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = trim;
exports.newUUID = newUUID;
const lib_1 = require("zero-width/lib");
const uuid_1 = require("uuid");
function trim(input) {
    return (0, lib_1.removeZeroWidth)((0, lib_1.nbspToSpace)(input))
        .replace(/^[\s　\u00A0]+|[\s　\u00A0]+$/g, '');
}
function newUUID(siteID, id) {
    let seed = siteID + '#' + id;
    //return hashSum(seed)
    return (0, uuid_1.v5)(seed, uuid_1.v5.URL);
}
//# sourceMappingURL=util.js.map