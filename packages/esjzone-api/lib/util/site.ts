/**
 * Created by user on 2019/12/19.
 */

import { LazyURL } from 'lazy-url';
import LazyURLSearchParams from 'http-form-urlencoded';
import { trimUnsafe } from '../util';
import { IESJzoneRecentUpdateRowBook, IESJzoneChapter } from '../types';
import moment from 'moment';

export enum EnumParseInputUrl
{
	UNKNOWN,
	STRING,
	NUMBER,
	URL,
	URLSEARCHPARAMS,
}

export function _handleInputUrl<T extends string | number | URL | LazyURL | LazyURLSearchParams | URLSearchParams>(_input: T)
{
	if (typeof _input === 'number')
	{
		let value = _input.toString();

		return {
			type: EnumParseInputUrl.NUMBER as const,
			_input,
			value,
		}
	}
	else if (typeof _input === 'string' && /^\d+$/.test(_input))
	{
		let value = _input.toString();

		return {
			type: EnumParseInputUrl.NUMBER as const,
			_input,
			value,
		}
	}
	else if (typeof _input === 'string')
	{
		let value = _input.toString();

		try
		{
			let u = new URL(value);

			return {
				type: EnumParseInputUrl.URL as const,
				_input,
				value: new LazyURL(u),
			}
		}
		catch (e)
		{

		}

		return {
			type: EnumParseInputUrl.STRING as const,
			_input,
			value,
		}
	}
	else if (_input instanceof LazyURL)
	{
		let value = _input;

		return {
			type: EnumParseInputUrl.URL as const,
			_input,
			value,
		}
	}
	else if (_input instanceof URL)
	{
		let value = new LazyURL(_input);

		return {
			type: EnumParseInputUrl.URL as const,
			_input,
			value,
		}
	}
	else if (_input instanceof LazyURLSearchParams)
	{
		let value = _input;

		return {
			type: EnumParseInputUrl.URLSEARCHPARAMS as const,
			_input,
			value,
		}
	}
	else if (_input instanceof URLSearchParams)
	{
		let value = new LazyURLSearchParams(_input);

		return {
			type: EnumParseInputUrl.URLSEARCHPARAMS as const,
			_input,
			value,
		}
	}

	let value = _input.toString();

	if (/^\d+$/.test(value))
	{
		return {
			type: EnumParseInputUrl.NUMBER as const,
			_input,
			value,
		}
	}

	return {
		type: EnumParseInputUrl.UNKNOWN as const,
		_input,
		value,
	}
}

export function parseUrl<T extends string | number | URL | LazyURL>(input: T)
{
	let data = _handleInputUrl(input);

	let ret = {
		...data,
	};

	switch (data.type)
	{

	}

	return ret;
}

export function _fixCoverUrl(cover: string | URL)
{
	if (!cover)
	{
		return;
	}

	let u = new LazyURL(cover);
	if (/esjzone/.test(u.host) && u.pathname.includes('empty.jpg'))
	{
		return
	}

	return u.toRealString();
}

export function _remove_ad($: JQueryStatic)
{
	$('p[class]:has(> script), script[src*=google], > .adsbygoogle').remove();
}

export function _getBookElemDesc($: JQueryStatic)
{
	return $('#details .description')
}

export function _getBookCover($: JQueryStatic)
{
	let _cover: string;
	$('.container .product-gallery .gallery-item img[src]')
		.toArray()
		.some((elem) =>
		{

			let cover = _fixCoverUrl($(elem).prop('src'))

			if (cover = _fixCoverUrl(cover))
			{
				return _cover = cover;
			}
		})
	;

	return _cover
}

export function _getBookTags($: JQueryStatic, tags: string[] = [])
{
	$('.widget-tags a.tag[href*="tag"]')
		.each((i, elem) =>
		{
			let _this = $(elem);
			let name = trimUnsafe(_this.text());

			if (name)
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

			if (name)
			{
				tags.push(name);
			}
		})
	;

	return tags
}

export function _parseSiteLink(chapter_link: string): {
	novel_id?: string,
	chapter_id?: string,
}
{
	let _m = chapter_link
		.match(/esjzone\.cc\/forum\/(\d+)\/(\d+)\.html?/)
	;

	let novel_id: string;
	let chapter_id: string;

	if (_m)
	{
		novel_id = _m[1];
		chapter_id = _m[2];

		return {
			novel_id,
			chapter_id,
		}
	}

	_m = chapter_link
		.match(/esjzone\.cc\/detail\/(\d+)/)
	;

	if (_m)
	{
		novel_id = _m[1];

		return {
			novel_id,
		}
	}
}

export function _getBookChapters($: JQueryStatic,
	_content: JQuery<HTMLElement>,
	data: Pick<IESJzoneRecentUpdateRowBook, 'chapters' | 'last_update_chapter_name'>,
)
{
	let volume_order = 0;
	let chapter_order = 0;

	let body = _content.find('#chapterList').find('p.non, a[href]');

	data.chapters[volume_order] = {
		volume_name: null,
		volume_order,
		chapters: [],
	};

	body
		.each((i, elem) =>
		{
			let _this = $(elem);

			if (_this.is('.non'))
			{
				let volume_name = trimUnsafe(_this.text());

				if (volume_name)
				{
					if (chapter_order || data.chapters[volume_order].volume_name != null)
					{
						volume_order++;
					}

					data.chapters[volume_order] = {
						volume_name,
						volume_order,
						chapters: [],
					};

					chapter_order = 0;
				}
			}
			else
			{
				let _a = _this;

				if (_a.length)
				{
					let chapter_link = _a.prop('href');

					let _m = _parseSiteLink(chapter_link)

					let chapter_name = trimUnsafe(_a.text());

					if (_m)
					{
						data.chapters[volume_order]
							.chapters
							.push({
								novel_id: _m.novel_id,
								chapter_id: _m.chapter_id,

								chapter_name,

								chapter_order,
								chapter_link,
							})
						;
					}
					else
					{
						data.chapters[volume_order]
							.chapters
							.push({
								chapter_name,
								chapter_order,
								chapter_link,
							})
						;
					}

					data.last_update_chapter_name = chapter_name;
				}

				chapter_order++;
			}
		})
	;

	return data
}

export function _matchDateString(_text: string)
{
	return _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2})\b/) || _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2})\b/)
}

export function _getBookInfo($: JQueryStatic,
	data: Pick<IESJzoneRecentUpdateRowBook, 'name' | 'authors' | 'last_update_time'>,
)
{
	data.name = trimUnsafe($('.container .row:eq(0) h2:eq(0)').text());

	$('.book-detail > li')
		.each(function (i, elem)
		{
			let _this = $(this);

			let _text = trimUnsafe(_this.text());

			let _m: RegExpMatchArray;

			if (_m = _text.match(/作者\s*[：:]\s*([^\n]+)/))
			{
				data.authors = trimUnsafe(_m[1])
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

	return data
}

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

			if (name === href)
			{
				name = undefined;
			}

			links.push({
				name,
				href,
			})

		})
	;

	return links
}

export function _getChapterDomContent($: JQueryStatic)
{
	return $('.container .forum-content')
}

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
