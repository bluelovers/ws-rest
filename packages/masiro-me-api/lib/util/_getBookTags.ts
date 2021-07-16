import { trimUnsafe } from './trim';

export function _getBookTags($: JQueryStatic, tags: string[] = [])
{
	$('.n-detail .tags a .label')
		.each((index, elem) => {

			let s = trimUnsafe($(elem).text())

			if (s.length)
			{
				tags ??= [];
				tags.push(s)
			}
		})
	;

	return tags;
}

