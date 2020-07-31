"use strict";
/**
 * Created by user on 2020/4/9.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleInputUrl = exports.EnumParseInputUrl = void 0;
const http_form_urlencoded_1 = __importDefault(require("http-form-urlencoded"));
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
    if (typeof _input === 'number') {
        let value = _input.toString();
        return {
            type: EnumParseInputUrl.NUMBER,
            _input,
            value,
        };
    }
    else if (typeof _input === 'string' && /^\d+$/.test(_input)) {
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
    else if (_input instanceof lazy_url_1.LazyURL) {
        let value = _input;
        return {
            type: EnumParseInputUrl.URL,
            _input,
            value,
        };
    }
    else if (_input instanceof URL) {
        let value = new lazy_url_1.LazyURL(_input);
        return {
            type: EnumParseInputUrl.URL,
            _input,
            value,
        };
    }
    else if (_input instanceof http_form_urlencoded_1.default) {
        let value = _input;
        return {
            type: EnumParseInputUrl.URLSEARCHPARAMS,
            _input,
            value,
        };
    }
    else if (_input instanceof URLSearchParams) {
        let value = new http_form_urlencoded_1.default(_input);
        return {
            type: EnumParseInputUrl.URLSEARCHPARAMS,
            _input,
            value,
        };
    }
    let value = _input.toString();
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
//# sourceMappingURL=index.js.map