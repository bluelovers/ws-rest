"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnValueToJSDOM = void 0;
const hook_1 = require("restful-decorator/lib/decorators/hook");
function ReturnValueToJSDOM(options) {
    return function ReturnValueToJSDOM(target, propertyName, descriptor) {
        (0, hook_1.setHookReturnValue)(function () {
            return this.$returnValue = this._responseDataToJSDOM(this.$returnValue, this.$response, options);
        }, target, propertyName);
    };
}
exports.ReturnValueToJSDOM = ReturnValueToJSDOM;
//# sourceMappingURL=jsdom.js.map