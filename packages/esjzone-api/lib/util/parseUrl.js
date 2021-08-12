"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = void 0;
const parse_input_url_1 = require("@node-novel/parse-input-url");
function parseUrl(input) {
    let data = (0, parse_input_url_1._handleInputUrl)(input);
    let ret = {
        ...data,
    };
    switch (data.type) {
    }
    return ret;
}
exports.parseUrl = parseUrl;
//# sourceMappingURL=parseUrl.js.map