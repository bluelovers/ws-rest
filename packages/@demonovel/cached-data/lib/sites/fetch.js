"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.fetch = void 0;
const types_1 = require("./types");
const core_1 = __importStar(require("./core"));
const local_1 = __importDefault(require("./local"));
const bluebird_1 = __importDefault(require("bluebird"));
function fetch(opts = {}) {
    return bluebird_1.default
        .resolve(Object.keys(types_1.id_packs_map))
        .reduce(async (a, siteID) => {
        if (opts.local) {
            a[siteID] = await local_1.default(siteID);
        }
        else {
            a[siteID] = await core_1.fetch(siteID)
                .timeout(5000)
                .catch(e => local_1.default(siteID));
        }
        return a;
    }, {});
}
exports.fetch = fetch;
function fetchFile(force, opts) {
    return bluebird_1.default
        .resolve(Object.keys(types_1.id_packs_map))
        .reduce(async (a, siteID) => {
        if (opts.local) {
            a[siteID] = await local_1.default(siteID);
        }
        else {
            a[siteID] = await core_1.default(siteID, force)
                .timeout(5000)
                .catch(e => local_1.default(siteID));
        }
        return a;
    }, {});
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=fetch.js.map