import { _handleInputUrl, EnumParseInputUrl, IAllowedInput } from '@node-novel/parse-input-url';
import { ITSRequireAtLeastOne } from 'ts-type';

/**
 * 支援
 * - https://www.novelstar.com.tw/books/7495.html
 */
export function _parseUrlInfo<T extends IAllowedInput>(input: T)
{
	const data = _handleInputUrl(input);

	let novel_id: string;
	let chapter_id: string;

	let user_id: string;

	let value: string;

	switch (data.type)
	{
		case EnumParseInputUrl.NUMBER:
			novel_id = data.value
			break;
		case EnumParseInputUrl.URL:
			value = data.value.toRealString();
		case EnumParseInputUrl.URLSEARCHPARAMS:
		case EnumParseInputUrl.STRING:
			value ??= data.value as string;
			value = value.toString();

			let m: RegExpExecArray;

			if (m = /books\/(\d+)\.html/.exec(value))
			{
				novel_id = m[1];
				break;
			}

			if (m = /author\/(\d+)\.html/.exec(value))
			{
				user_id = m[1];
				break;
			}

			if (m = /read\.php\?id=(\d+)/.exec(value))
			{
				chapter_id = m[1];
				break;
			}

	}

	value ??= data.value as any;

	return {
		novel_id,
		chapter_id,

		user_id,

		value,
		_input: data._input,
	}
}

export type IReturnTypeParseUrlInfo = ReturnType<typeof _parseUrlInfo>

export function _buildURLByParseUrlInfo(input: ITSRequireAtLeastOne<IReturnTypeParseUrlInfo, Exclude<keyof IReturnTypeParseUrlInfo, 'value' | '_input'>>,
	baseURL?: string,
)
{
	baseURL ??= 'https://www.novelstar.com.tw/';

	if (input.novel_id)
	{
		return `${baseURL}/books/${input.novel_id}.html`
	}
	else if (input.chapter_id)
	{
		return `${baseURL}/admin/novelReading?cid=${input.chapter_id}`
	}
	else if (input.user_id)
	{
		return `${baseURL}/author/${input.user_id}.html`
	}
}

