import { trimUnsafe } from './trim';
import { _getBookTranslator } from './_getBookTranslator';
import { _getBookTags } from './_getBookTags';
import { IMasiroMeBook } from '../types';
import moment from 'moment';
import { zhRegExp } from 'regexp-cjk';
import { _handleBookInfo } from './_handleBookInfo';

export function _getBookInfo($: JQueryStatic, novel_id: number | string)
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

	let book: IMasiroMeBook = {
		id: novel_id,
		title,
		authors,
		translator,
		tags,
		updated,
		content,
	}

	_handleBookInfo(book);

	return book
}
