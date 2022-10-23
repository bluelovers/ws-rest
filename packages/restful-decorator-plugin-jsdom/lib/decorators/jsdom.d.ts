/**
 * Created by user on 2019/12/19.
 */
import AbstractHttpClientWithJSDom from '../index';
import { IMemberMethods } from 'restful-decorator/lib/decorators/build';
import { IConstructorOptions as IJSDOMConstructorOptions } from 'jsdom-extra/lib/pack';
export declare function ReturnValueToJSDOM<T extends IJSDOMConstructorOptions>(options?: T): <T_1 extends AbstractHttpClientWithJSDom, P extends Extract<import("ts-type").ITSKeyofByExtractType<T_1, Function, Extract<keyof T_1, import("ts-type").ITSPropertyKey>>, import("ts-type").ITSPropertyKey>>(target: T_1, propertyName: P, descriptor: TypedPropertyDescriptor<IMemberMethods<T_1>[P]>) => void;
