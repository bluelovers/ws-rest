/**
 * Created by user on 2019/6/8.
 */

import 'reflect-metadata';
import { getMemberMetadata, hasMemberMetadata, IPropertyKey, setMemberMetadata } from 'reflect-metadata-util';

export const SymConfig = Symbol(`config`);

export function getConfig(target: any, propertyName?: IPropertyKey)
{
	return getMemberMetadata(SymConfig, target, propertyName) || {};
}

export function setConfig(value: object, target: any, propertyName?: IPropertyKey)
{
	return setMemberMetadata(SymConfig, value, target, propertyName);
}

export function hasConfig(target: any, propertyName?: IPropertyKey)
{
	return hasMemberMetadata(SymConfig, target, propertyName);
}
