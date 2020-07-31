/**
 * Created by user on 2019/11/21.
 */
import { removeZeroWidth } from 'zero-width';
import { IDiscuzForum, IDiscuzForumPickThreads } from './types';
export { removeZeroWidth };
export declare function trimUnsafe<T extends string>(input: T): T;
export declare function _getForumLastThreadSubject(forum: IDiscuzForum | IDiscuzForumPickThreads): {
    last_thread_time: number;
    last_thread_id: string;
    thread_type: string;
    thread_typeid: string;
    thread_subject: string;
    thread_subject_full: string;
};
