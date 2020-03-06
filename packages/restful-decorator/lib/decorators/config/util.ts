/**
 * Created by user on 2019/6/8.
 */

import 'reflect-metadata';
import { getMemberMetadata, hasMemberMetadata, IPropertyKey, setMemberMetadata } from 'reflect-metadata-util';

export const SymConfig = Symbol(`config`);

export function getConfig<T extends any = any>(target: any, propertyName?: IPropertyKey): T
{
	return getMemberMetadata(SymConfig, target, propertyName) || {} as T;
}

export function setConfig<T extends any>(value: T, target: any, propertyName?: IPropertyKey)
{
	return setMemberMetadata(SymConfig, value, target, propertyName);
}

export function hasConfig(target: any, propertyName?: IPropertyKey)
{
	return hasMemberMetadata(SymConfig, target, propertyName);
}
