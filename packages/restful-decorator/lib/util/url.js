"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lazy_url_1 = __importDefault(require("lazy-url"));
function urlNormalize(input) {
    if (input instanceof lazy_url_1.default) {
        return input.toRealString();
    }
    else if (input instanceof URL) {
        return input.toString();
    }
    return new lazy_url_1.default(input).toRealString();
}
exports.urlNormalize = urlNormalize;
exports.default = urlNormalize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQStCO0FBSS9CLFNBQWdCLFlBQVksQ0FBQyxLQUFlO0lBRTNDLElBQUksS0FBSyxZQUFZLGtCQUFPLEVBQzVCO1FBQ0MsT0FBTyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDNUI7U0FDSSxJQUFJLEtBQUssWUFBWSxHQUFHLEVBQzdCO1FBQ0MsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDeEI7SUFFRCxPQUFPLElBQUksa0JBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMxQyxDQUFDO0FBWkQsb0NBWUM7QUFFRCxrQkFBZSxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF6eVVSTCBmcm9tICdsYXp5LXVybCc7XG5cbmV4cG9ydCB0eXBlIElVcmxMaWtlID0gc3RyaW5nIHwgVVJMIHwgTGF6eVVSTDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVybE5vcm1hbGl6ZShpbnB1dDogSVVybExpa2UpXG57XG5cdGlmIChpbnB1dCBpbnN0YW5jZW9mIExhenlVUkwpXG5cdHtcblx0XHRyZXR1cm4gaW5wdXQudG9SZWFsU3RyaW5nKCk7XG5cdH1cblx0ZWxzZSBpZiAoaW5wdXQgaW5zdGFuY2VvZiBVUkwpXG5cdHtcblx0XHRyZXR1cm4gaW5wdXQudG9TdHJpbmcoKTtcblx0fVxuXG5cdHJldHVybiBuZXcgTGF6eVVSTChpbnB1dCkudG9SZWFsU3RyaW5nKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVybE5vcm1hbGl6ZTtcbiJdfQ==