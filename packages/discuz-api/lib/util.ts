/**
 * Created by user on 2019/11/21.
 */

// @ts-ignore
import { removeZeroWidth } from 'zero-width';
import { crlf } from 'crlf-normalize';
import { IDiscuzForum, IDiscuzForumThread, IDiscuzForumPickThreads } from './types';

export { removeZeroWidth }

export function trimUnsafe<T extends string>(input: T): T
{
	// @ts-ignore
	return removeZeroWidth(crlf(input))
		.replace(/^\s+|\s+$/gu, '')
		.replace(/[\u00A0]/gu, ' ')
		.replace(/[\t ]+/gu, ' ')
		.trim()
}

export function _getForumLastThreadSubject(forum: IDiscuzForum | IDiscuzForumPickThreads)
{
	let thread_subject: string = forum.last_thread_subject;
	let thread_subject_full: string = forum.last_thread_subject;
	let {
		last_thread_id,
		last_thread_time,
	} = forum;
	let thread_type: string;
	let thread_typeid: string;

	if (forum.last_thread_id)
	{
		let thread: IDiscuzForumThread;

		forum.threads.some(v => {
			if (v.tid == forum.last_thread_id)
			{
				thread = v;

				return true;
			}
		});

		if (thread && thread.typeid)
		{
			thread_type = forum.thread_types[thread.typeid];
			thread_typeid = thread.typeid;

			thread_subject_full = thread_type + ' ' + thread_subject;
		}
	}

	return {
		last_thread_time,
		last_thread_id,

		thread_type,
		thread_typeid,

		thread_subject,
		thread_subject_full,
	};
}
