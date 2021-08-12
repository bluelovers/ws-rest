import { trimUnsafe } from '../util';
import { array_unique_overwrite } from 'array-hyper-unique';

export function _getBookTags($: JQueryStatic, tags: string[] = [])
{
	$('.widget-tags a.tag[href*="tag"]')
		.each((i, elem) =>
		{
			let _this = $(elem);
			let name = trimUnsafe(_this.text());

			if (name.length)
			{
				tags.push(name);
			}
		})
	;

	$('.page-title .container .column h1')
		.each((i, elem) =>
		{
			let _this = $(elem);
			let name = trimUnsafe(_this.text());

			if (name.length)
			{
				tags.push(name);
			}
		})
	;

	array_unique_overwrite(tags);

	return tags
}
