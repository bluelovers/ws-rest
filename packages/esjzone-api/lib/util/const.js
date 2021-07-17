"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reType = exports.reTitle = exports.reAuthors = void 0;
const regexp_cjk_1 = require("regexp-cjk");
exports.reAuthors = new regexp_cjk_1.zhRegExp(/作者\s*[：:]\s*([^\n]+)/);
exports.reTitle = new regexp_cjk_1.zhRegExp(/(?:书|書)名\s*[：:]\s*([^\n]+)/);
exports.reType = new regexp_cjk_1.zhRegExp(/類型\s*[：:]\s*([^\n]+)/);
//# sourceMappingURL=const.js.map