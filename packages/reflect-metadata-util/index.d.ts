import 'reflect-metadata';
export declare type IPropertyKey = string | symbol;
/**
 * use for class, member, decorators
 */
export declare function getMemberMetadata<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): T;
export declare function hasMemberMetadata<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): boolean;
/**
 * use for class, member, decorators
 */
export declare function setMemberMetadata(metadataKey: any, metadataValue: any, target: object, propertyKey?: IPropertyKey): void;
/**
 * use for constructor, member, decorators
 */
export declare function getPrototypeOfMetadata<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): T;
export declare function hasPrototypeOfMetadata<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): boolean;
/**
 * use for constructor, member, decorators
 */
export declare function setPrototypeOfMetadata(metadataKey: any, metadataValue: any, target: object, propertyKey?: IPropertyKey): void;
export declare function getMetadataLazy<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): T;
export declare function getMetadataPropertyFirst<T extends any>(metadataKey: any, target: object, propertyKey: IPropertyKey): T;
/**
 * same as getMetadata, but get top metadata first
 */
export declare function getMetadataTopFirst<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): T;
export declare function getPrototypeOfConstructor(target: object): Function;
export interface IParameterDecorator<K extends IPropertyKey = IPropertyKey, T extends object = object> {
    (target: T, propertyKey: K, parameterIndex: number): void;
}
export declare function buildParameterDecorator<K extends IPropertyKey = IPropertyKey, T extends object = object>(fn: IParameterDecorator<K, T>): IParameterDecorator<K, T>;
