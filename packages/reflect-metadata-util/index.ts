import 'reflect-metadata';

export type IPropertyKey = string | symbol;

/**
 * use for class, member, decorators
 */
export function getMemberMetadata<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): T
{
	return Reflect.getMetadata(metadataKey, target, propertyKey)
}

export function hasMemberMetadata<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey)
{
	return Reflect.hasMetadata(metadataKey, target, propertyKey)
}

/**
 * use for class, member, decorators
 */
export function setMemberMetadata(metadataKey: any, metadataValue: any, target: object, propertyKey?: IPropertyKey)
{
	return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)
}

/**
 * use for constructor, member, decorators
 */
export function getPrototypeOfMetadata<T extends any>(metadataKey: any,
	target: object,
	propertyKey?: IPropertyKey,
): T
{
	return Reflect.getMetadata(metadataKey, getPrototypeOfConstructor(target), propertyKey)
}

export function hasPrototypeOfMetadata<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey)
{
	return Reflect.hasMetadata(metadataKey, getPrototypeOfConstructor(target), propertyKey)
}

/**
 * use for constructor, member, decorators
 */
export function setPrototypeOfMetadata(metadataKey: any,
	metadataValue: any,
	target: object,
	propertyKey?: IPropertyKey,
)
{
	return Reflect.defineMetadata(metadataKey, metadataValue, getPrototypeOfConstructor(target), propertyKey)
}

export function getMetadataLazy<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): T
{
	if (hasMemberMetadata(metadataKey, target, propertyKey))
	{
		return getMemberMetadata(metadataKey, target, propertyKey)
	}

	return getPrototypeOfMetadata(metadataKey, target, propertyKey)
}

export function getMetadataPropertyFirst<T extends any>(metadataKey: any, target: object, propertyKey: IPropertyKey): T
{
	let ret = getMetadataLazy(metadataKey, target, propertyKey);

	if (typeof ret !== 'undefined')
	{
		// @ts-ignore
		return ret;
	}

	return getMetadataLazy(metadataKey, target)
}

/**
 * same as getMetadata, but get top metadata first
 */
export function getMetadataTopFirst<T extends any>(metadataKey: any, target: object, propertyKey?: IPropertyKey): T
{
	if (hasPrototypeOfMetadata(metadataKey, target, propertyKey))
	{
		return getPrototypeOfMetadata(metadataKey, target, propertyKey)
	}

	return getMemberMetadata(metadataKey, target, propertyKey)
}

export function getPrototypeOfConstructor(target: object)
{
	return Reflect.getPrototypeOf(target).constructor
}

export interface IParameterDecorator<K extends IPropertyKey = IPropertyKey, T extends object = object>
{
	(target: T, propertyKey: K, parameterIndex: number): void
}

export function buildParameterDecorator<K extends IPropertyKey = IPropertyKey, T extends object = object>(fn: IParameterDecorator<K, T>): IParameterDecorator<K, T>
{
	if (typeof fn !== 'function')
	{
		throw new TypeError(`fn not a IParameterDecorator`)
	}

	return function (target: T, propertyKey: K, parameterIndex: number)
	{
		return fn(target, propertyKey, parameterIndex)
	}
}
