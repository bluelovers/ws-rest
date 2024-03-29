import { _handleInputUrl, EnumParseInputUrl, IAllowedInput } from '@node-novel/parse-input-url';
import { ITSRequireAtLeastOne } from 'ts-type';

/**
 * 支援
 * - https://masi.ro/n378
 * - https://masi.ro/c29630
 * - https://masi.ro/p6172
 * - https://masi.ro/f25
 * - novel_id=
 * - cid=
 * - forum_id=
 * - post_id=
 * - user_id=
 */
export function _parseUrlInfo<T extends IAllowedInput>(input: T)
{
	const data = _handleInputUrl(input);

	let novel_id: string;
	let chapter_id: string;

	let forum_id: string;
	let post_id: string;

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

			if (m = /^n?(\d+)$/.exec(value))
			{
				novel_id = m[1];
				break;
			}

			if (m = /masi\.ro\/n(\d+)/.exec(value))
			{
				novel_id = m[1];
				break;
			}

			if (m = /masi\.ro\/c(\d+)$/.exec(value))
			{
				chapter_id = m[1];
				break;
			}

			if (m = /masi\.ro\/f(\d+)/.exec(value))
			{
				forum_id = m[1];
				break;
			}

			if (m = /masi\.ro\/p(\d+)$/.exec(value))
			{
				post_id = m[1];
				break;
			}

			if (m = /novel_id=(\d+)/.exec(value))
			{
				novel_id = m[1];
				break;
			}

			if (m = /cid=(\d+)/.exec(value))
			{
				chapter_id = m[1];
				break;
			}

			if (m = /forum_id=(\d+)/.exec(value))
			{
				forum_id = m[1];
				break;
			}

			if (m = /post_id=(\d+)/.exec(value))
			{
				post_id = m[1];
				break;
			}

			if (m = /user_id=(\d+)/.exec(value))
			{
				user_id = m[1];
				break;
			}
	}

	value ??= data.value as any;

	return {
		novel_id,
		chapter_id,

		forum_id,
		post_id,

		user_id,

		value,
		_input: data._input,
	}
}

export type IReturnTypeParseUrlInfo = ReturnType<typeof _parseUrlInfo>

export function _buildURLByParseUrlInfo(input: ITSRequireAtLeastOne<IReturnTypeParseUrlInfo, Exclude<keyof IReturnTypeParseUrlInfo, 'value' | '_input'>>, baseURL?: string)
{
	baseURL ??= 'https://masiro.me';

	if (input.novel_id)
	{
		return `${baseURL}/admin/novelView?novel_id=${input.novel_id}`
	}
	else if (input.chapter_id)
	{
		return `${baseURL}/admin/novelReading?cid=${input.chapter_id}`
	}
	else if (input.forum_id)
	{
		return `${baseURL}/admin/forum?forum_id=${input.forum_id}`
	}
	else if (input.post_id)
	{
		return `${baseURL}/admin/post?post_id=${input.post_id}`
	}
	else if (input.user_id)
	{
		return `${baseURL}/admin/userCenterShow?user_id=${input.user_id}`
	}
}

