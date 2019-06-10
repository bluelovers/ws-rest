"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQStCO0FBSS9CLFNBQWdCLGFBQWEsQ0FBQyxLQUFlO0lBRTVDLElBQUksS0FBSyxZQUFZLGtCQUFPLEVBQzVCO1FBQ0MsT0FBTyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDNUI7U0FDSSxJQUFJLEtBQUssWUFBWSxHQUFHLEVBQzdCO1FBQ0MsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDeEI7SUFFRCxPQUFPLElBQUksa0JBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMxQyxDQUFDO0FBWkQsc0NBWUM7QUFFRCxTQUFnQixZQUFZLENBQUMsS0FBZTtJQUUzQyxJQUFJLEtBQUssWUFBWSxrQkFBTyxFQUM1QjtRQUNDLE9BQU8sS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQzVCO1NBQ0ksSUFBSSxLQUFLLFlBQVksR0FBRyxFQUM3QjtRQUNDLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3hCO0lBRUQsMkNBQTJDO0lBQzNDLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pCLENBQUM7QUFiRCxvQ0FhQztBQUVELGtCQUFlLFlBQVksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXp5VVJMIGZyb20gJ2xhenktdXJsJztcblxuZXhwb3J0IHR5cGUgSVVybExpa2UgPSBzdHJpbmcgfCBVUkwgfCBMYXp5VVJMO1xuXG5leHBvcnQgZnVuY3Rpb24gdXJsTm9ybWFsaXplMihpbnB1dDogSVVybExpa2UpXG57XG5cdGlmIChpbnB1dCBpbnN0YW5jZW9mIExhenlVUkwpXG5cdHtcblx0XHRyZXR1cm4gaW5wdXQudG9SZWFsU3RyaW5nKCk7XG5cdH1cblx0ZWxzZSBpZiAoaW5wdXQgaW5zdGFuY2VvZiBVUkwpXG5cdHtcblx0XHRyZXR1cm4gaW5wdXQudG9TdHJpbmcoKTtcblx0fVxuXG5cdHJldHVybiBuZXcgTGF6eVVSTChpbnB1dCkudG9SZWFsU3RyaW5nKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cmxOb3JtYWxpemUoaW5wdXQ6IElVcmxMaWtlKVxue1xuXHRpZiAoaW5wdXQgaW5zdGFuY2VvZiBMYXp5VVJMKVxuXHR7XG5cdFx0cmV0dXJuIGlucHV0LnRvUmVhbFN0cmluZygpO1xuXHR9XG5cdGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgVVJMKVxuXHR7XG5cdFx0cmV0dXJuIGlucHV0LnRvU3RyaW5nKCk7XG5cdH1cblxuXHQvL3JldHVybiBuZXcgTGF6eVVSTChpbnB1dCkudG9SZWFsU3RyaW5nKCk7XG5cdHJldHVybiBpbnB1dC50b1N0cmluZygpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cmxOb3JtYWxpemU7XG4iXX0=