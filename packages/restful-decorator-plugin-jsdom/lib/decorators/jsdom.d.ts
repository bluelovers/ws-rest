/**
 * Created by user on 2019/12/19.
 */
import AbstractHttpClientWithJSDom from '../index';
import { IMemberMethodsKeys, IMemberMethods } from 'restful-decorator/lib/decorators/build';
import { IConstructorOptions as IJSDOMConstructorOptions } from 'jsdom-extra/lib/pack';
export declare function ReturnValueToJSDOM<T extends IJSDOMConstructorOptions>(options?: T): <T_1 extends AbstractHttpClientWithJSDom, P extends IMemberMethodsKeys<T_1>>(target: T_1, propertyName: P, descriptor: TypedPropertyDescriptor<IMemberMethods<T_1>[P]>) => void;
