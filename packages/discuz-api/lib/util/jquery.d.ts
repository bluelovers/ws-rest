/// <reference types="jquery" />
import { IDiscuzForumThread } from '../types';
/**
 * Created by user on 2019/12/17.
 */
export declare function _checkLoginByJQuery($: JQueryStatic): boolean;
export declare function _checkLoginUsername($: JQueryStatic): string;
export declare function _jqForumStickThreads($: JQueryStatic): IDiscuzForumThread[];
export declare function _jqForumThreads($: JQueryStatic, selector?: string): {
    last_thread_time: number;
    last_thread_id: string;
    last_thread_subject: string;
    threads: IDiscuzForumThread[];
};
export declare function _jqForumThreadTypes($: JQueryStatic): Record<string, string>;
