"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgBB = void 0;
const tslib_1 = require("tslib");
const lib_1 = require("restful-decorator/lib");
const decorators_1 = require("restful-decorator/lib/decorators");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const SymApiOptions = Symbol('options');
let ImgBB = class ImgBB extends lib_1.AbstractHttpClient {
    constructor(options) {
        super(options.defaults, options);
    }
    _init(defaults, options, ...argv) {
        defaults = super._init(defaults, ...argv);
        this[SymApiOptions] = Object.assign(this[SymApiOptions] || {}, options);
        return defaults;
    }
    setAccessToken(accessToken) {
        this[SymApiOptions].token = accessToken;
        return this;
    }
    /**
     * API v1 calls can be done using the POST or GET request methods but since GET request are limited by the maximum allowed length of an URL you should prefer the POST request method.
     */
    upload(jsonData) {
        const $returnValue = this.$returnValue;
        if ($returnValue && $returnValue.data) {
            $returnValue.data.image.size = $returnValue.data.image.size | 0;
            $returnValue.data.thumb.size = $returnValue.data.thumb.size | 0;
        }
        return bluebird_1.default.resolve($returnValue);
    }
};
(0, tslib_1.__decorate)([
    (0, decorators_1.POST)('1/upload'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.HandleParamMetadata)((data) => {
        const [argv] = data.argv;
        if (argv) {
            if (typeof argv.image !== 'string') {
                if (Buffer.isBuffer(argv.image)) {
                    argv.image = argv.image.toString('base64');
                }
            }
            if (argv.key == null) {
                // @ts-ignore
                argv.key = data.thisArgv[SymApiOptions].token;
            }
        }
        return data;
    }),
    (0, decorators_1.methodBuilder)(),
    (0, decorators_1.CatchError)(function (e) {
        if (e.response.data && e.response.data.message) {
            return bluebird_1.default.reject(e.response.data);
        }
        return bluebird_1.default.reject(e);
    }),
    (0, tslib_1.__param)(0, (0, decorators_1.ParamMapAuto)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Object)
], ImgBB.prototype, "upload", null);
ImgBB = (0, tslib_1.__decorate)([
    (0, decorators_1.BaseUrl)('https://api.imgbb.com/'),
    (0, decorators_1.Headers)({
        'Accept': 'application/json',
    }),
    (0, decorators_1.RequestConfigs)({
        responseType: 'json',
    }),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], ImgBB);
exports.ImgBB = ImgBB;
exports.default = ImgBB;
//# sourceMappingURL=index.js.map