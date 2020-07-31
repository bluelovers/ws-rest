"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgBB = void 0;
const lib_1 = require("restful-decorator/lib");
const decorators_1 = require("restful-decorator/lib/decorators");
const bluebird_1 = __importDefault(require("bluebird"));
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
__decorate([
    decorators_1.POST('1/upload'),
    decorators_1.FormUrlencoded,
    decorators_1.HandleParamMetadata((data) => {
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
    decorators_1.methodBuilder(),
    decorators_1.CatchError(function (e) {
        if (e.response.data && e.response.data.message) {
            return bluebird_1.default.reject(e.response.data);
        }
        return bluebird_1.default.reject(e);
    }),
    __param(0, decorators_1.ParamMapAuto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ImgBB.prototype, "upload", null);
ImgBB = __decorate([
    decorators_1.BaseUrl('https://api.imgbb.com/'),
    decorators_1.Headers({
        'Accept': 'application/json',
    }),
    decorators_1.RequestConfigs({
        responseType: 'json',
    }),
    __metadata("design:paramtypes", [Object])
], ImgBB);
exports.ImgBB = ImgBB;
exports.default = ImgBB;
//# sourceMappingURL=index.js.map