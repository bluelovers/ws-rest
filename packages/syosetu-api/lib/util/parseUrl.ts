import { _handleInputUrl, EnumParseInputUrl } from '@node-novel/parse-input-url';
import { LazyURL } from 'lazy-url';
import { validNcode } from './valid';

export function parseUrlInfo<T extends string | number | URL | LazyURL>(input: T)
{
	const data = _handleInputUrl(input);

	let novel_r18: boolean;
	let novel_id: string;
	let chapter_id: string;
	let value: string;

	switch (data.type)
	{
		case EnumParseInputUrl.NUMBER:
			chapter_id = data.value;
			break;
		case EnumParseInputUrl.URL:
			value = data.value.toRealString();
			//break;
		case EnumParseInputUrl.STRING:
			value = value ?? data.value as string;

			if (validNcode(value))
			{
				novel_id = value
				break;
			}

			if (/(novel18)\.syosetu\.com/.test(value))
			{
				novel_r18 = true;
			}

			let r: RegExp;
			let m: RegExpExecArray;

			r = /\.syosetu\.com\/(n\w{5,6})(?:\/?(\d+))?/;
			if (m = r.exec(value))
			{
				novel_id = m[1];
				chapter_id = m[2];
				break;
			}

			r = /\/?(n\w{5,6})\/(\d+)\//;
			if (m = r.exec(value))
			{
				novel_id = m[1];
				chapter_id = m[2];
				break;
			}

			break;
	}

	return {
		novel_r18,
		novel_id,
		chapter_id,
	}
}

export function buildLink(data: {
	novel_r18?: boolean,
	novel_id: string,
	chapter_id?: string,
	protocol?: string,
})
{
	return `${data.protocol ?? 'http:'}//${data.novel_r18 ? 'novel18' : 'ncode'}.syosetu.com/${data.novel_id}/${data.chapter_id ?? ''}`;
}

export function buildUrl(data: {
	novel_r18?: boolean,
	novel_id: string,
	chapter_id?: string,
	protocol?: string,
})
{
	return new LazyURL(buildLink(data))
}
