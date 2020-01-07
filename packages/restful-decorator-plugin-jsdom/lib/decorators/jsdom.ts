/**
 * Created by user on 2019/12/19.
 */
import AbstractHttpClientWithJSDom from '../index';
import { IMemberMethodsKeys, IMemberMethods } from 'restful-decorator/lib/decorators/build';
import { setHookReturnValue } from 'restful-decorator/lib/decorators/hook';
import { IConstructorOptions as IJSDOMConstructorOptions } from 'jsdom-extra/lib/pack';

export function ReturnValueToJSDOM<T extends IJSDOMConstructorOptions>(options?: T)
{
	return function ReturnValueToJSDOM<T extends AbstractHttpClientWithJSDom, P extends IMemberMethodsKeys<T>>(target: T,
		propertyName: P,
		descriptor: TypedPropertyDescriptor<IMemberMethods<T>[P]>,
	)
	{
		setHookReturnValue(function (this: AbstractHttpClientWithJSDom)
		{
			return this.$returnValue = this._responseDataToJSDOM(this.$returnValue, this.$response, options);

		}, target, propertyName);
	}
}
