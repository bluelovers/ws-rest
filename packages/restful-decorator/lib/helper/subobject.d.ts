/**
 * Created by user on 2019/6/7.
 */
import { ITSOverwrite } from 'ts-type';
export declare type IMethod<T = {}, P = {}> = {
    $parent?: IMethod<P>;
} & ITSOverwrite<Omit<P, '$parent'>, Omit<T, '$parent'>>;
export declare function subobject<T = {}, P = {}>(attr: T, parent: IMethod<P>): IMethod<T, P>;
export default subobject;
