import { IESJzoneRecentUpdateRowBook } from '../types';
import { trimUnsafe } from '../util';
import { reAuthors, reTitle, reType } from './const';
import moment from 'moment';
import { array_unique_overwrite } from 'array-hyper-unique';
import { _matchDateString } from './_matchDateString';

export function _getBookInfo($: JQueryStatic,
	data: Pick<IESJzoneRecentUpdateRowBook, 'name' | 'titles' | 'authors' | 'last_update_time' | 'tags'>,
): Pick<IESJzoneRecentUpdateRowBook, 'name' | 'titles' | 'authors' | 'last_update_time' | 'tags'>
{
	data.name = trimUnsafe($('.container .row:eq(0) h2:eq(0)').text());

	$('.book-detail > li')
		.each(function (i, elem)
		{
			let _this = $(this);

			let _text = trimUnsafe(_this.text());

			let _m: RegExpMatchArray;

			if (_m = _text.match(reAuthors))
			{
				data.authors = trimUnsafe(_m[1])
			}
			else if (_m = _text.match(reTitle))
			{
				let title = trimUnsafe(_m[1]);

				if (title.length > 0 && title !== data.name)
				{
					data.titles ??= [];
					data.titles.push(trimUnsafe(_m[1]))
				}
			}
			else if (_m = _text.match(reType))
			{
				let _s = trimUnsafe(_m[1])

				if (_s.length)
				{
					data.tags ??= [];
					data.tags.push(_s)
				}
			}
			else if (_m = _matchDateString(_text))
			{
				try
				{
					let last_update_time = moment(_m[1]).unix();
					data.last_update_time = last_update_time;
				}
				catch (e)
				{

				}
			}

		})
	;

	if (data.titles?.length)
	{
		array_unique_overwrite(data.titles);
	}

	return data
}
