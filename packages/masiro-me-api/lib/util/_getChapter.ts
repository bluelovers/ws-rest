import { IMasiroMeChapter } from '../types';
import { tryMinifyHTMLOfElem } from 'restful-decorator-plugin-jsdom/lib/html';
import { _p_2_br } from 'restful-decorator-plugin-jsdom/lib/jquery';
import { _getChapterData } from './_getChapterData';

export function _getChapter($: JQueryStatic, chapter_id: string | number, options: {
	rawHtml?: boolean,
	cb?(data: {
		i: number,
		$elem: JQuery<HTMLElement>,
		$content: JQuery<HTMLElement>,
		src: string,
		imgs: string[],
	}): void,
} = {}): IMasiroMeChapter
{
	let $content = $('.content .row .box-body.nvl-content');

	$content = tryMinifyHTMLOfElem($content);

	_p_2_br($content.find('> p'), $, true);

	$content.find('p, br').after(`\n`);

	let imgs = [] as string[];

	const { cb } = options;

	let html: string;

	if (options.rawHtml)
	{
		html = $content.html();
	}

	$content
		.find('img[src]')
		.each((i, elem) =>
		{
			let $elem = $(elem);
			let src = $elem.prop('src').trim();

			imgs.push(src);

			if (cb)
			{
				cb({
					i,
					$elem,
					$content,
					src,
					imgs,
				})
			}
		})
	;

	let text = $content
		.text()
		.replace(/^\s+|\s+$/g, '')
	;

	let { author, dateline } = _getChapterData($);

	return {
		chapter_id: chapter_id.toString(),

		imgs,
		text,
		html,

		author,
		dateline,
	}
}
