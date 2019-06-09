/**
 * Created by user on 2019/6/9.
 */
import { ITSArrayListMaybeReadonly } from 'ts-type';
declare const SymTransform: unique symbol;
declare const SymOptions: unique symbol;
export interface IOptions {
    /**
     * '&k=&v=1' => '&k&v=1'
     * only work for create new
     */
    emptyValueToKeyOnly?: boolean;
    /**
     * transform value to x-www-form-urlencoded
     */
    transform?: boolean;
    allowNull?: boolean;
}
export declare type IURLSearchParamsInit = any[][] | [any, any][] | Record<string, any> | string | URLSearchParams;
export declare class LazyURLSearchParams extends URLSearchParams implements URLSearchParams {
    [SymOptions]: IOptions;
    [SymTransform](value: any, options?: IOptions): any;
    constructor(init?: IURLSearchParamsInit, options?: IOptions);
    /**
     * all null value will transform to ''
     */
    append(name: string, value: string | any, options?: IOptions): void;
    /**
     * all null value will transform to ''
     */
    set(name: string, value: string | any, options?: IOptions): void;
    /**
     * append
     */
    push(...values: ITSArrayListMaybeReadonly<unknown>[]): void;
    /**
     * set
     */
    extend(values: Record<any, any>, options?: IOptions): void;
    clone<T extends URLSearchParams = LazyURLSearchParams>(): T;
    toString(): string;
}
export declare function _core(init?: IURLSearchParamsInit, options?: IOptions): IURLSearchParamsInit;
export declare function transformKey(value: string): string;
export declare function transformValue(value: any, options?: IOptions): any;
export default LazyURLSearchParams;
