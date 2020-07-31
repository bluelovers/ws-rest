/**
 * Created by user on 2019/6/13.
 */
import { AxiosError } from 'axios';
import { ITSResolvable } from 'ts-type/lib/generic';
export declare function CatchResponseDataError<T, R = any>(fn?: (data: T, err: AxiosError<T>) => ITSResolvable<R>): MethodDecorator;
