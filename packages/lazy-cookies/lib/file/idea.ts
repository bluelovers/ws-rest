/**
 * Created by user on 2019/6/10.
 */

import crlf, { LF } from 'crlf-normalize';
import LazyCookie from '../../index';
import toughCookie from 'tough-cookie';

export function parse(line: string)
{
	line = line.trim();

	if (!line.startsWith('#') && line.length)
	{
		let [ domain, path, key, value, expires ] = line.split('\t');

		// @ts-ignore
		expires = new Date(Date.parse(expires));

		let cookies = new LazyCookie({
			domain,
			path,
			key,
			value,
			expires: expires as any as Date
		});

		return cookies
	}
}

export function parseFile(input: string)
{
	return crlf(input)
		.split(LF)
		.reduce((arr, line) => {

			let cookies = parse(line.trim());

			if (cookies)
			{
				arr.push(cookies);
			}

			return arr;
		}, [] as LazyCookie[])
	;
}

export function stringify(cookie: LazyCookie | toughCookie.Cookie, skipInvalid?: boolean)
{
	let { domain, path, key, value, expires } = cookie;

	if (domain == null || path == null || key == null)
	{
		if (!skipInvalid)
		{
			throw new TypeError(`can't stringify, field is miss ${cookie}`)
		}
	}

	return [domain, path, key, value, new Date(expires).toUTCString()].join('\t');
}

export default parseFile
