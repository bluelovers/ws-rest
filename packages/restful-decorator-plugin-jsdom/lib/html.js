"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryMinifyHTMLOfElem = exports.tryMinifyHTML = exports.minifyHTML = void 0;
const html_util_1 = require("@jsdom-extra/html-util");
Object.defineProperty(exports, "minifyHTML", { enumerable: true, get: function () { return html_util_1.minifyHTML; } });
Object.defineProperty(exports, "tryMinifyHTML", { enumerable: true, get: function () { return html_util_1.tryMinifyHTML; } });
Object.defineProperty(exports, "tryMinifyHTMLOfElem", { enumerable: true, get: function () { return html_util_1.tryMinifyHTMLOfElem; } });
exports.default = html_util_1.tryMinifyHTML;
//# sourceMappingURL=html.js.map