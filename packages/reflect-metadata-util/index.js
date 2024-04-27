"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberMetadata = getMemberMetadata;
exports.hasMemberMetadata = hasMemberMetadata;
exports.setMemberMetadata = setMemberMetadata;
exports.getPrototypeOfMetadata = getPrototypeOfMetadata;
exports.hasPrototypeOfMetadata = hasPrototypeOfMetadata;
exports.setPrototypeOfMetadata = setPrototypeOfMetadata;
exports.getMetadataLazy = getMetadataLazy;
exports.getMetadataPropertyFirst = getMetadataPropertyFirst;
exports.getMetadataTopFirst = getMetadataTopFirst;
exports.getPrototypeOfConstructor = getPrototypeOfConstructor;
exports.buildParameterDecorator = buildParameterDecorator;
require("reflect-metadata");
/**
 * use for class, member, decorators
 */
function getMemberMetadata(metadataKey, target, propertyKey) {
    return Reflect.getMetadata(metadataKey, target, propertyKey);
}
function hasMemberMetadata(metadataKey, target, propertyKey) {
    return Reflect.hasMetadata(metadataKey, target, propertyKey);
}
/**
 * use for class, member, decorators
 */
function setMemberMetadata(metadataKey, metadataValue, target, propertyKey) {
    return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
}
/**
 * use for constructor, member, decorators
 */
function getPrototypeOfMetadata(metadataKey, target, propertyKey) {
    return Reflect.getMetadata(metadataKey, getPrototypeOfConstructor(target), propertyKey);
}
function hasPrototypeOfMetadata(metadataKey, target, propertyKey) {
    return Reflect.hasMetadata(metadataKey, getPrototypeOfConstructor(target), propertyKey);
}
/**
 * use for constructor, member, decorators
 */
function setPrototypeOfMetadata(metadataKey, metadataValue, target, propertyKey) {
    return Reflect.defineMetadata(metadataKey, metadataValue, getPrototypeOfConstructor(target), propertyKey);
}
function getMetadataLazy(metadataKey, target, propertyKey) {
    if (hasMemberMetadata(metadataKey, target, propertyKey)) {
        return getMemberMetadata(metadataKey, target, propertyKey);
    }
    return getPrototypeOfMetadata(metadataKey, target, propertyKey);
}
function getMetadataPropertyFirst(metadataKey, target, propertyKey) {
    let ret = getMetadataLazy(metadataKey, target, propertyKey);
    if (typeof ret !== 'undefined') {
        // @ts-ignore
        return ret;
    }
    return getMetadataLazy(metadataKey, target);
}
/**
 * same as getMetadata, but get top metadata first
 */
function getMetadataTopFirst(metadataKey, target, propertyKey) {
    if (hasPrototypeOfMetadata(metadataKey, target, propertyKey)) {
        return getPrototypeOfMetadata(metadataKey, target, propertyKey);
    }
    return getMemberMetadata(metadataKey, target, propertyKey);
}
function getPrototypeOfConstructor(target) {
    return Reflect.getPrototypeOf(target).constructor;
}
function buildParameterDecorator(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError(`fn not a IParameterDecorator`);
    }
    return function (target, propertyKey, parameterIndex) {
        return fn(target, propertyKey, parameterIndex);
    };
}
//# sourceMappingURL=index.js.map