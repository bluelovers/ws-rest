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
const core_1 = __importStar(require("./core"));
const bluebird_1 = __importDefault(require("bluebird"));
const types_1 = require("./types");
function fetch() {
    return bluebird_1.default.props({
        [types_1.siteID]: core_1.fetch(),
    });
}
exports.fetch = fetch;
function fetchFile(force) {
    return bluebird_1.default.props({
        [types_1.siteID]: core_1.default(force),
    });
}
exports.fetchFile = fetchFile;
exports.default = fetchFile;
//# sourceMappingURL=fetch.js.map