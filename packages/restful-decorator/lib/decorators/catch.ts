/**
 * Created by user on 2019/6/11.
 */
import { checkMemberDecoratorsOnly } from '../helper/decorators';
import { ITSPickExtra, ITSRequireAtLeastOne, ITSResolvable } from 'ts-type';
import { IPropertyKey, setMemberMetadata, getMemberMetadata, getMetadataLazy } from 'reflect-metadata-util';
import { AxiosError } from 'axios';

export const SymCatchError = Symbol('CatchError');

export function CatchError<E extends Error | AxiosError<unknown> = AxiosError<unknown>>(fnCatch: (e: E) => ITSResolvable<any>): MethodDecorator
{
	return function (target, propertyKey)
	{
		checkMemberDecoratorsOnly(`CatchError`, target, propertyKey)

		setMemberMetadata(SymCatchError, fnCatch, target, propertyKey)
	}
}

export function getCatchError<E extends Error, R>(target: any, propertyKey: IPropertyKey): (e: E) => ITSResolvable<R>
{
	return getMetadataLazy(SymCatchError, target, propertyKey)
}

export default CatchError
