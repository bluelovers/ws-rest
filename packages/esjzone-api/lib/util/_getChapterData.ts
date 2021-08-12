import { IESJzoneChapter } from '../types';
import { trimUnsafe } from '../util';
import moment from 'moment';
import { _matchDateString } from './_matchDateString';

export function _getChapterData($: JQueryStatic): Pick<IESJzoneChapter, 'author' | 'dateline' | 'chapter_name'>
{
	let $meta = $('.container .single-post-meta .column');

	$meta.eq(0).find('span:eq(0)').remove();
	$meta.eq(1).find('i:eq(0)').remove();

	let author = trimUnsafe($meta.eq(0).text());
	let dateline: number;

	let _m = _matchDateString(trimUnsafe($meta.eq(1).text()));

	if (_m)
	{
		let unix = moment(_m[1]).unix();
		if (unix > 0)
		{
			dateline = unix
		}
	}

	let chapter_name = trimUnsafe($('.container .row .single-post-meta + h2').text());

	return {
		chapter_name,
		author,
		dateline,
	}
}
