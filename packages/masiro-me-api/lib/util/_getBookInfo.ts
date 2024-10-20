import { trimUnsafe } from './trim';
import { _getBookTranslator } from './_getBookTranslator';
import { _getBookTags } from './_getBookTags';
import { IMasiroMeBook } from '../types';
import moment from 'moment';
import { zhRegExp } from 'regexp-cjk';
import { _handleBookInfo } from './_handleBookInfo';
import { _getImgSrc } from './_getImgSrc';
import { re404, reAuthors, reDesc, reLastUpdateName, reStates } from './const';

export function _getBookInfo($: JQueryStatic, novel_id: number | string, baseURL?: string): IMasiroMeBook
{
	novel_id = novel_id.toString();

	if (re404.test(trimUnsafe($('#app .content').text())))
	{
		return null
	}

	let authors: string[] = [];
	let _author = trimUnsafe($('.n-detail .author').text().replace(reAuthors, ''));

	if (_author.length)
	{
		authors.push(_author)
	}

	let translator: string[] = _getBookTranslator($);

	let tags: string[] = _getBookTags($);

	let _date = trimUnsafe($('.n-detail .n-update .s-font').text());
	let updated: number;

	if (_date?.length)
	{
		updated = moment(_date).valueOf()
	}

	let content = trimUnsafe($('.content .brief').text())
		.replace(reDesc, '')
	;

	let title = trimUnsafe($('.novel-title').text());

	let _img = $('.content .with-border .has-img img.img');
	let cover = _getImgSrc(_img, baseURL);

	let last_update_name = trimUnsafe($('.n-update .nw-a').text().replace(reLastUpdateName, ''));

	let status_text = trimUnsafe($('.n-status').text().replace(reStates, ''));

	if (status_text?.length)
	{
		tags ??= [];
		tags.push(status_text);
	}

	let book: IMasiroMeBook = {
		id: novel_id,
		title,
		cover,
		authors,
		translator,
		tags,
		updated,
		status_text,
		last_update_name,
		content,
	}

	_handleBookInfo(book);

	return book
}
