/**
 * Created by user on 2019/12/19.
 */
import AbstractHttpClientWithJSDom from '../index';
import { IMemberMethods } from 'restful-decorator/lib/decorators/build';
import { IConstructorOptions as IJSDOMConstructorOptions } from 'jsdom-extra/lib/pack';
export declare function ReturnValueToJSDOM<T extends IJSDOMConstructorOptions>(options?: T): <T_1 extends AbstractHttpClientWithJSDom, P extends Extract<Extract<keyof T_1, import("reflect-metadata-util").IPropertyKey>, import("reflect-metadata-util").IPropertyKey>>(target: T_1, propertyName: P, descriptor: TypedPropertyDescriptor<import("ts-type").ITSExtractRecord<T_1, Function, Extract<keyof T_1, import("reflect-metadata-util").IPropertyKey>>[P]>) => void;
