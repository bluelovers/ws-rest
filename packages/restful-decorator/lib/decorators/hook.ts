/**
 * Created by user on 2019/12/19.
 */
import { ITSResolvable } from 'ts-type';
import { getMetadataLazy, IPropertyKey, setMemberMetadata } from 'reflect-metadata-util';
import { checkMemberDecoratorsOnly } from '../helper/decorators';

export const SymHookReturnValue = Symbol('HookThenReturnAfter');

export function setHookReturnValue(callback: Function, target: any, propertyKey: IPropertyKey)
{
		setMemberMetadata(SymHookReturnValue, callback, target, propertyKey)
}

export function getHookReturnValue(target: any, propertyKey: IPropertyKey)
{
	return getMetadataLazy(SymHookReturnValue, target, propertyKey)
}
