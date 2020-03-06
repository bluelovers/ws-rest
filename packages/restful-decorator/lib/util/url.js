"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlNormalize = exports.urlNormalize2 = void 0;
const lazy_url_1 = __importDefault(require("lazy-url"));
function urlNormalize2(input) {
    if (input instanceof lazy_url_1.default) {
        return input.toRealString();
    }
    else if (input instanceof URL) {
        return input.toString();
    }
    return new lazy_url_1.default(input).toRealString();
}
exports.urlNormalize2 = urlNormalize2;
function urlNormalize(input) {
    if (input instanceof lazy_url_1.default) {
        return input.toRealString();
    }
    else if (input instanceof URL) {
        return input.toString();
    }
    //return new LazyURL(input).toRealString();
    return input.toString();
}
exports.urlNormalize = urlNormalize;
exports.default = urlNormalize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdEQUErQjtBQUkvQixTQUFnQixhQUFhLENBQUMsS0FBZTtJQUU1QyxJQUFJLEtBQUssWUFBWSxrQkFBTyxFQUM1QjtRQUNDLE9BQU8sS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQzVCO1NBQ0ksSUFBSSxLQUFLLFlBQVksR0FBRyxFQUM3QjtRQUNDLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3hCO0lBRUQsT0FBTyxJQUFJLGtCQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDMUMsQ0FBQztBQVpELHNDQVlDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLEtBQWU7SUFFM0MsSUFBSSxLQUFLLFlBQVksa0JBQU8sRUFDNUI7UUFDQyxPQUFPLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUM1QjtTQUNJLElBQUksS0FBSyxZQUFZLEdBQUcsRUFDN0I7UUFDQyxPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN4QjtJQUVELDJDQUEyQztJQUMzQyxPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN6QixDQUFDO0FBYkQsb0NBYUM7QUFFRCxrQkFBZSxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF6eVVSTCBmcm9tICdsYXp5LXVybCc7XG5cbmV4cG9ydCB0eXBlIElVcmxMaWtlID0gc3RyaW5nIHwgVVJMIHwgTGF6eVVSTDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVybE5vcm1hbGl6ZTIoaW5wdXQ6IElVcmxMaWtlKVxue1xuXHRpZiAoaW5wdXQgaW5zdGFuY2VvZiBMYXp5VVJMKVxuXHR7XG5cdFx0cmV0dXJuIGlucHV0LnRvUmVhbFN0cmluZygpO1xuXHR9XG5cdGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgVVJMKVxuXHR7XG5cdFx0cmV0dXJuIGlucHV0LnRvU3RyaW5nKCk7XG5cdH1cblxuXHRyZXR1cm4gbmV3IExhenlVUkwoaW5wdXQpLnRvUmVhbFN0cmluZygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXJsTm9ybWFsaXplKGlucHV0OiBJVXJsTGlrZSlcbntcblx0aWYgKGlucHV0IGluc3RhbmNlb2YgTGF6eVVSTClcblx0e1xuXHRcdHJldHVybiBpbnB1dC50b1JlYWxTdHJpbmcoKTtcblx0fVxuXHRlbHNlIGlmIChpbnB1dCBpbnN0YW5jZW9mIFVSTClcblx0e1xuXHRcdHJldHVybiBpbnB1dC50b1N0cmluZygpO1xuXHR9XG5cblx0Ly9yZXR1cm4gbmV3IExhenlVUkwoaW5wdXQpLnRvUmVhbFN0cmluZygpO1xuXHRyZXR1cm4gaW5wdXQudG9TdHJpbmcoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXJsTm9ybWFsaXplO1xuIl19