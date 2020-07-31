"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildParameterDecorator = exports.getPrototypeOfConstructor = exports.getMetadataTopFirst = exports.getMetadataPropertyFirst = exports.getMetadataLazy = exports.setPrototypeOfMetadata = exports.hasPrototypeOfMetadata = exports.getPrototypeOfMetadata = exports.setMemberMetadata = exports.hasMemberMetadata = exports.getMemberMetadata = void 0;
require("reflect-metadata");
/**
 * use for class, member, decorators
 */
function getMemberMetadata(metadataKey, target, propertyKey) {
    return Reflect.getMetadata(metadataKey, target, propertyKey);
}
exports.getMemberMetadata = getMemberMetadata;
function hasMemberMetadata(metadataKey, target, propertyKey) {
    return Reflect.hasMetadata(metadataKey, target, propertyKey);
}
exports.hasMemberMetadata = hasMemberMetadata;
/**
 * use for class, member, decorators
 */
function setMemberMetadata(metadataKey, metadataValue, target, propertyKey) {
    return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
}
exports.setMemberMetadata = setMemberMetadata;
/**
 * use for constructor, member, decorators
 */
function getPrototypeOfMetadata(metadataKey, target, propertyKey) {
    return Reflect.getMetadata(metadataKey, getPrototypeOfConstructor(target), propertyKey);
}
exports.getPrototypeOfMetadata = getPrototypeOfMetadata;
function hasPrototypeOfMetadata(metadataKey, target, propertyKey) {
    return Reflect.hasMetadata(metadataKey, getPrototypeOfConstructor(target), propertyKey);
}
exports.hasPrototypeOfMetadata = hasPrototypeOfMetadata;
/**
 * use for constructor, member, decorators
 */
function setPrototypeOfMetadata(metadataKey, metadataValue, target, propertyKey) {
    return Reflect.defineMetadata(metadataKey, metadataValue, getPrototypeOfConstructor(target), propertyKey);
}
exports.setPrototypeOfMetadata = setPrototypeOfMetadata;
function getMetadataLazy(metadataKey, target, propertyKey) {
    if (hasMemberMetadata(metadataKey, target, propertyKey)) {
        return getMemberMetadata(metadataKey, target, propertyKey);
    }
    return getPrototypeOfMetadata(metadataKey, target, propertyKey);
}
exports.getMetadataLazy = getMetadataLazy;
function getMetadataPropertyFirst(metadataKey, target, propertyKey) {
    let ret = getMetadataLazy(metadataKey, target, propertyKey);
    if (typeof ret !== 'undefined') {
        // @ts-ignore
        return ret;
    }
    return getMetadataLazy(metadataKey, target);
}
exports.getMetadataPropertyFirst = getMetadataPropertyFirst;
/**
 * same as getMetadata, but get top metadata first
 */
function getMetadataTopFirst(metadataKey, target, propertyKey) {
    if (hasPrototypeOfMetadata(metadataKey, target, propertyKey)) {
        return getPrototypeOfMetadata(metadataKey, target, propertyKey);
    }
    return getMemberMetadata(metadataKey, target, propertyKey);
}
exports.getMetadataTopFirst = getMetadataTopFirst;
function getPrototypeOfConstructor(target) {
    return Reflect.getPrototypeOf(target).constructor;
}
exports.getPrototypeOfConstructor = getPrototypeOfConstructor;
function buildParameterDecorator(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError(`fn not a IParameterDecorator`);
    }
    return function (target, propertyKey, parameterIndex) {
        return fn(target, propertyKey, parameterIndex);
    };
}
exports.buildParameterDecorator = buildParameterDecorator;
//# sourceMappingURL=index.js.map