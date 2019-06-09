/**
 * Created by user on 2019/6/8.
 */
import 'reflect-metadata';
import { IPropertyKey } from 'reflect-metadata-util';
export declare const SymConfig: unique symbol;
export declare function getConfig(target: any, propertyName?: IPropertyKey): any;
export declare function setConfig(value: object, target: any, propertyName?: IPropertyKey): void;
export declare function hasConfig(target: any, propertyName?: IPropertyKey): boolean;
