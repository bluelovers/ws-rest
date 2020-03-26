/**
 * Created by user on 2019/12/19.
 */

import { LazyURL } from 'lazy-url';
import LazyURLSearchParams from 'http-form-urlencoded';

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
