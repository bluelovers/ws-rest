/**
 * Created by user on 2019/12/19.
 */

import { LazyURL } from 'lazy-url';
import LazyURLSearchParams from 'http-form-urlencoded';

export enum EnumParseInputUrl
{
	UNKNOWN,
	STRING,
	URL,
	URLSEARCHPARAMS,
}

export function parseInputUrl<T extends string | number | URL | LazyURL | LazyURLSearchParams | URLSearchParams>(_input: T)
{
	if (typeof _input === 'number')
	{
		let value = _input.toString();

		return {
			type: EnumParseInputUrl.STRING,
			_input,
			value,
		} as const
	}
	else if (typeof _input === 'string')
	{
		let value = _input.toString();

		return {
			type: EnumParseInputUrl.STRING,
			_input,
			value,
		} as const
	}
	else if (_input instanceof LazyURL)
	{
		let value = _input;

		return {
			type: EnumParseInputUrl.URL,
			_input,
			value,
		} as const
	}
	else if (_input instanceof URL)
	{
		let value = new LazyURL(_input);

		return {
			type: EnumParseInputUrl.URL,
			_input,
			value,
		} as const
	}
	else if (_input instanceof LazyURLSearchParams)
	{
		let value = _input;

		return {
			type: EnumParseInputUrl.URLSEARCHPARAMS,
			_input,
			value,
		} as const
	}
	else if (_input instanceof URLSearchParams)
	{
		let value = new LazyURLSearchParams(_input);

		return {
			type: EnumParseInputUrl.URLSEARCHPARAMS,
			_input,
			value,
		} as const
	}

	let value = _input.toString();

	return {
		type: EnumParseInputUrl.UNKNOWN,
		_input,
		value,
	} as const
}

export function generateUrl<T extends string | number | URL | LazyURL>(input: T)
{
	let data = parseInputUrl(input);



}
