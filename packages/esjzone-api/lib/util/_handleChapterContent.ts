import { IESJzoneChapter, IESJzoneChapterLocked, IESJzoneChapterOptions } from '../types';
import { tryMinifyHTMLOfElem } from 'restful-decorator-plugin-jsdom/lib/html';
import { _remove_ad } from './_remove_ad';
import { _getChapterDomContent } from './_getChapterDomContent';
import { _p_2_br } from 'restful-decorator-plugin-jsdom/lib/jquery';
import { _getChapterData } from './_getChapterData';
import { _checkChapterLock } from './_checkChapterLock';

export function _handleChapterContentRoot($: JQueryStatic, argv: {
	novel_id: string | number,
	chapter_id: string | number,
}, options: IESJzoneChapterOptions)
{
	let $content = $('.container .row:has(.forum-content)');

	$content = tryMinifyHTMLOfElem($content);

	_remove_ad($);

	return $content
}

export function _handleChapterContentCore($: JQueryStatic, argv: {
	novel_id: string | number,
	chapter_id: string | number,
}, options: IESJzoneChapterOptions)
{
	options ??= {};

	/*
	const _decodeChapter = async () =>
	{
		let code: string;

		if (!code)
		{
			code = _getCode(jsdom.serialize());
		}

		if (!code)
		{
			$('script')
				.each((i, elem) =>
				{

					let html = $(elem).text();

					code = _getCode(html);
				})
			;
		}

		await this._getDecodeChapter({
				novel_id: argv.novel_id,
				chapter_id: argv.chapter_id,
				code,
			})
			.then(a =>
			{
				let elems = $('.trans, .t');

				a.forEach((v, i) =>
				{
					elems.eq(i).html(v);
				});

				return a;
			})
		;

		function _getCode(html: string): string
		{
			let m = html
				.match(/getTranslation\(['"]([^\'"]+)['"]/i)
			;

			if (m)
			{
				return m[1];
			}
		}
	};

	//await _decodeChapter();

	//_remove_ad($);
	 */

	let $content = _getChapterDomContent($)

	_p_2_br($content.find('> p'), $);

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

	let { author, dateline } = _getChapterData($)

	return {
		locked: false,
		imgs,
		text,
		html,
	}
}

export function _handleChapterContent($: JQueryStatic, argv: {
	novel_id: string | number,
	chapter_id: string | number,
}, options: IESJzoneChapterOptions): Pick<IESJzoneChapterLocked, 'locked' | 'imgs' | 'text' | 'html'> | Pick<IESJzoneChapter, 'locked' | 'imgs' | 'text' | 'html'>
{
	let _check = _checkChapterLock($);
	let ret = {
		locked: _check.locked,
	} as any;

	if (!_check.locked)
	{
		ret = _handleChapterContentCore($, argv, options);
	}

	return ret
}
