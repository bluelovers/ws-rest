import moment from 'moment';
import LazyURL from 'lazy-url';
import { IDiscuzForum, IDiscuzForumThread } from '../types';
import { trimUnsafe } from '../util';

/**
 * Created by user on 2019/12/17.
 */

export function _checkLoginByJQuery($: JQueryStatic)
{
	return $('.vwmy a[href*="uid="], #loginstatusid')
		.length > 1
}

export function _checkLoginUsername($: JQueryStatic)
{
	if (_checkLoginByJQuery($))
	{
		let user = $('.vwmy a[href*="uid="]').text()
			.replace(/^\s+|\s+$/g, '');

		if (user.length)
		{
			return user
		}
	}

	return
}

export function _jqForumStickThreads($: JQueryStatic)
{
	return _jqForumThreads($, '#threadlisttableid tbody[id^="stickthread_"]').threads;
}

export function _jqForumThreads($: JQueryStatic, selector = '#threadlisttableid tbody[id^="normalthread_"]')
{
	let last_thread_time: number;
	let last_thread_subject: string;
	let last_thread_id: string;

	let threads: IDiscuzForumThread[] = [];

	$(selector)
		.each((i, elem) => {

			let _tr = $(elem);

			let _a = _tr.find('th a.s.xst:eq(0)');

			let subject = trimUnsafe(_a.text());

			let tid = new LazyURL(_a.prop('href'))
				.searchParams.get('tid') as any
			;

			let dateline: number;

			_a = _tr.find('.by:eq(0) em span');

			if (_a.length)
			{
				let title: string;

				_a.each((i, elem) => {

					let _a = $(elem);
					let text = _a.text();

					if (_a.is('[title]'))
					{
						title = _a.prop('title');
					}
					else if (/\d+-\d+-\d+/.test(text))
					{
						title = text;
					}
				});

				if (/\d+-\d+-\d+/.test(title))
				{
					dateline = moment(title, 'YYYY-MM-DD').unix();
				}
				else
				{
					throw new TypeError(_tr.html())
				}
			}

			if (last_thread_time == null)
			{
				last_thread_time = dateline;
				last_thread_subject = subject;
				last_thread_id = tid;
			}

			_a = _tr.find('.by:eq(0) cite a');

			let authorid: string;
			let author: string;

			if (_a.length)
			{
				author = _a.text();
				authorid = (new LazyURL(_a.prop('href')).searchParams.get('uid') as any)
			}

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
		last_thread_id,
		last_thread_subject,
		threads,
	}
}

export function _jqForumThreadTypes($: JQueryStatic)
{
	let thread_types: IDiscuzForum["thread_types"] = {};

	$('#thread_types a[href*="typeid="]')
		.each((i, elem) => {

			let _a = $(elem).clone();

			_a.find('.num').remove();

			let typeid = new LazyURL(_a.prop('href'))
				.searchParams.get('typeid')
			;

			let name = trimUnsafe(_a.text());

			thread_types[typeid] = name;

		})
	;

	return thread_types;
}
