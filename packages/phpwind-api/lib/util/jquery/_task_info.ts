import { IPHPWindTaskRowDoing } from '../../types';

/**
 * Created by user on 2020/5/13.
 */

export function _parseTaskInfo($: JQueryStatic, _tr: JQuery<HTMLElement>)
{
	let _tds = _tr.find('> td');

	if (_tds.length <= 1)
	{
		return;
	}

	let _a = _tr.find('> td:eq(1)').find('> b:eq(0), > a > b:eq(0)');

	let task_name = _a.text();

	let task_credit = _tr
		.find('> td:eq(2)')
		.text()
		.replace(/^[\n\r]+/g, '')
		.replace(/\s+$/g, '')
	;

	_a = _tr.find('a[onclick*="startjob"]:eq(0)');

	let task_id = (_a.attr('onclick') as string)
		?.match(/startjob\('(\d+)'/)
		?.[1]
	;

	_tds = _tr.next('.f_one').find('> td');

	let task_desc = _tds.text()
		.replace(/^[\n\r]+/g, '')
		.replace(/\s+$/g, '')
	;

	let task_percent = _tds
		.find('.taskbar .taskbar_text')
		.text()
		?.match(/\b(\d+(?:\.\d+)?)\s*%/)
		?.[1]
	;

	let task_drawable = !!task_id;

	let obj: IPHPWindTaskRowDoing = {
		task_id,
		task_name,
		task_desc,
		task_credit,

		task_percent,
		task_drawable,
	};

	return obj
}
