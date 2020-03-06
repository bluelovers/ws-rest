/**
 * Created by user on 2019/6/8.
 */
import 'reflect-metadata';
import { IPropertyKey } from 'reflect-metadata-util';
export declare const SymConfig: unique symbol;
export declare function getConfig<T extends any = any>(target: any, propertyName?: IPropertyKey): T;
export declare function setConfig<T extends any>(value: T, target: any, propertyName?: IPropertyKey): void;
export declare function hasConfig(target: any, propertyName?: IPropertyKey): boolean;
