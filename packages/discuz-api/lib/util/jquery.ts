import moment from 'moment';
import LazyURL from 'lazy-url';
import { IDiscuzForum, IDiscuzForumThread } from '../types';

/**
 * Created by user on 2019/12/17.
 */

export function _checkLoginByJQuery($: JQueryStatic)
{
	return $('.vwmy a[href*="uid="], #loginstatusid')
		.length > 1
}

export function _jqForumThreads($: JQueryStatic)
{
	let last_thread_time: number;
	let last_thread_subject: string;

	let threads: IDiscuzForumThread[] = [];

	$('#threadlisttableid tbody[id^="normalthread_"]')
		.each((i, elem) => {

			let _tr = $(elem);

			let _a = _tr.find('th a.s.xst:eq(0)');

			let subject = _a.text();

			let tid = new LazyURL(_a.prop('href'))
				.searchParams.get('tid') as any
			;

			let dateline = moment(_tr.find('.by:eq(0) em span span[title]').prop('title')).unix();

			if (last_thread_time == null)
			{
				last_thread_time = dateline;
				last_thread_subject = subject;
			}

			_a = _tr.find('.by:eq(0) cite a');

			let author = _a.text();
			let authorid = (new LazyURL(_a.prop('href')).searchParams.get('uid') as any);

			_a = _tr.find('th a[href*="typeid="]').eq(0);

			let typeid: string;

			if (_a.length)
			{
				typeid = new LazyURL(_a.prop('href')).searchParams.get('typeid');
			}

			threads.push({
				tid,
				typeid,
				subject,
				dateline,
				author,
				authorid,
			});

		})
	;

	return {
		last_thread_time,
		last_thread_subject,
		threads,
	}
}
