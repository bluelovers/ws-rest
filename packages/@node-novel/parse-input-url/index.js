"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleInputUrl = exports.EnumParseInputUrl = void 0;
const tslib_1 = require("tslib");
const http_form_urlencoded_1 = (0, tslib_1.__importDefault)(require("http-form-urlencoded"));
const lazy_url_1 = require("lazy-url");
var EnumParseInputUrl;
(function (EnumParseInputUrl) {
    EnumParseInputUrl[EnumParseInputUrl["UNKNOWN"] = 0] = "UNKNOWN";
    EnumParseInputUrl[EnumParseInputUrl["STRING"] = 1] = "STRING";
    EnumParseInputUrl[EnumParseInputUrl["NUMBER"] = 2] = "NUMBER";
    EnumParseInputUrl[EnumParseInputUrl["URL"] = 3] = "URL";
    EnumParseInputUrl[EnumParseInputUrl["URLSEARCHPARAMS"] = 4] = "URLSEARCHPARAMS";
})(EnumParseInputUrl = exports.EnumParseInputUrl || (exports.EnumParseInputUrl = {}));
function _handleInputUrl(_input) {
    if (typeof _input === 'number' || typeof _input === 'string' && /^\d+$/.test(_input)) {
        let value = _input.toString();
        return {
            type: EnumParseInputUrl.NUMBER,
            _input,
            value,
        };
    }
    else if (typeof _input === 'string') {
        let value = _input.toString();
        try {
            let u = new URL(value);
            return {
                type: EnumParseInputUrl.URL,
                _input,
                value: new lazy_url_1.LazyURL(u),
            };
        }
        catch (e) {
        }
        return {
            type: EnumParseInputUrl.STRING,
            _input,
            value,
        };
    }
    else if (_input instanceof lazy_url_1.LazyURL || _input instanceof URL) {
        let value = _input instanceof lazy_url_1.LazyURL ? _input : new lazy_url_1.LazyURL(_input);
        return {
            type: EnumParseInputUrl.URL,
            _input: _input,
            value,
        };
    }
    else if (_input instanceof http_form_urlencoded_1.default || _input instanceof URLSearchParams) {
        let value = new http_form_urlencoded_1.default(_input);
        return {
            type: EnumParseInputUrl.URLSEARCHPARAMS,
            _input,
            value,
        };
    }
    let value = String(_input);
    if (/^\d+$/.test(value)) {
        return {
            type: EnumParseInputUrl.NUMBER,
            _input,
            value,
        };
    }
    return {
        type: EnumParseInputUrl.UNKNOWN,
        _input,
        value,
    };
}
exports._handleInputUrl = _handleInputUrl;
exports.default = _handleInputUrl;
//# sourceMappingURL=index.js.map