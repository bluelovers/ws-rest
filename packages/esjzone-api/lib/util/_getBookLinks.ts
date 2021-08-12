import { IESJzoneRecentUpdateRowBook } from '../types';
import { trimUnsafe } from '../util';

export function _getBookLinks($: JQueryStatic, links: IESJzoneRecentUpdateRowBook["links"] = [])
{
	$('.book-detail')
		.find('a[href]')
		.not('.btn, .form-group *')
		.each((i, elem) =>
		{

			let _this = $(elem);

			let name = trimUnsafe(_this.text());
			let href = _this.prop('href') as string;

			if (name === href || name === '')
			{
				name = undefined;
			}

			if (!href.length || href === 'https://www.esjzone.cc/tags//')
			{
				return;
			}

			links.push({
				name,
				href,
			})

		})
	;

	return links
}
