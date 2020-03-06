/**
 * Created by user on 2019/6/7.
 */
import subobject from '../helper/subobject';
import { ITSRequireAtLeastOne, ITSMemberMethods, ITSKeyofMemberMethods } from 'ts-type';
import { IPropertyKey } from 'reflect-metadata-util';
import Bluebird from 'bluebird';
import { getCatchError } from './catch';
import { getHookReturnValue } from './hook';

export type IMemberMethods<T> = ITSMemberMethods<T>;

export type IMemberMethodsKeys<T> = ITSKeyofMemberMethods<T>;

export function methodBuilder<T extends object, R = {}>(handler?: IHandleDescriptor<T, IMemberMethodsKeys<T>>)
{
	return function <P extends IMemberMethodsKeys<T>>(target: T, propertyName: P, descriptor: TypedPropertyDescriptor<IMemberMethods<T>[P]>)
	{
		const oldMethod = descriptor.value;

		handler = handler || ((data) =>
		{
			return data;
		});

		// @ts-ignore
		descriptor.value = function (this: ThisType<T>, ...oldArgv: any[])
		{
			let {
				thisArgv = this,
				argv = oldArgv,
				method = oldMethod,
				returnValue,
			} = handler.call(this, {
				target,
				propertyName,
				thisArgv: this,
				method: oldMethod,
				argv: oldArgv,
			});

			if (thisArgv == null)
			{
				thisArgv = this;
			}

			let p: Bluebird<any> = Bluebird.bind(thisArgv);

			if (returnValue != null)
			{
				let fnHookReturnValue = getHookReturnValue(target, propertyName);

				if (fnHookReturnValue == null)
				{
					fnHookReturnValue = (data: any) => data;
				}

				p = p
					// @ts-ignore
					.thenReturn(returnValue)
					// @ts-ignore
					.then(fnHookReturnValue)
					// @ts-ignore
					.then(async function (returnValue){

						const ret = await method.apply(thisArgv, argv);

						if (ret != null)
						{
							return ret;
						}

						return returnValue;
					})
				;
			}
			else
			{
				p = p
					.thenReturn(method.apply(thisArgv, argv))
				;
			}

			const fnCatch = getCatchError(target, propertyName);

			if (fnCatch)
			{
				return p.catch(fnCatch)
			}

			return p;
		};
	};
}

export type ConstructorLikeType<T extends object = object> = new(...args: any) => T;

export type IHandleDescriptor<T extends object, P extends IMemberMethodsKeys<T> = IMemberMethodsKeys<T>> = (this: ThisType<T>, data: IHandleDescriptorParameters<T, P>) => IHandleDescriptorReturn<T, P>;

export type IHandleDescriptor2<T extends object, R = {}, P extends IMemberMethodsKeys<T> = IMemberMethodsKeys<T>> = (this: ThisType<T>, data: IHandleDescriptorParameters<T, P> & R) => IHandleDescriptorReturn2<T, R>;

export type IHandleDescriptor3<T extends object, R = {}, P extends IMemberMethodsKeys<T> = IMemberMethodsKeys<T>> = (this: ThisType<T>, data: IHandleDescriptorParameters<T, P> & R) => IHandleDescriptorReturn<T, P>;

export interface IHandleDescriptorParameters<T extends object, P extends IMemberMethodsKeys<T>>
{
	target: T;
	propertyName: P;
	thisArgv: Partial<T>;
	method: IMemberMethods<T>[P];
	argv: any[];
	returnValue?: PromiseLike<any>
}

export type IHandleDescriptorReturn<T extends object, P extends IMemberMethodsKeys<T>> = ITSRequireAtLeastOne<Partial<IHandleDescriptorParameters<T, P>>, 'thisArgv' | 'method' | 'argv' | 'returnValue'>;

export type IHandleDescriptorReturn2<T extends object, R> = ITSRequireAtLeastOne<IHandleDescriptorParameters<T, IMemberMethodsKeys<T>>, 'thisArgv' | 'method' | 'argv' | 'returnValue'> & R;

export default methodBuilder;
