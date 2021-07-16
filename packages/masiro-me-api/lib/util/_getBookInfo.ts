import { trimUnsafe } from './trim';
import { _getBookTranslator } from './_getBookTranslator';
import { _getBookTags } from './_getBookTags';
import { IMasiroMeBook } from '../types';
import moment from 'moment';
import { zhRegExp } from 'regexp-cjk';
import { _handleBookInfo } from './_handleBookInfo';
import { _getImgSrc } from './_getImgSrc';

export function _getBookInfo($: JQueryStatic, novel_id: number | string, baseURL?: string): IMasiroMeBook
{
	novel_id = novel_id.toString();

	let authors: string[] = [];
	let _author = trimUnsafe($('.n-detail .author').text());

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
		.replace(new zhRegExp(/^简介(?:：|:)\s*/), '')
	;

	let title = trimUnsafe($('.novel-title').text());

	let _img = $('.content .with-border .has-img img.img');
	let cover = _getImgSrc(_img, baseURL);

	let last_update_name = trimUnsafe($('.n-update .nw-a').text().replace(new zhRegExp(/^\s*最新(?:：|:)\s*/), ''));

	let book: IMasiroMeBook = {
		id: novel_id,
		title,
		cover,
		authors,
		translator,
		tags,
		updated,
		last_update_name,
		content,
	}

	_handleBookInfo(book);

	return book
}
