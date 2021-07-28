/**
 * Created by user on 2020/4/9.
 */

import LazyURLSearchParams from 'http-form-urlencoded';
import { LazyURL } from 'lazy-url';

export enum EnumParseInputUrl
{
	UNKNOWN,
	STRING,
	NUMBER,
	URL,
	URLSEARCHPARAMS,
}

export type IAllowedInput = string | number | URL | LazyURL | LazyURLSearchParams | URLSearchParams;

export function _handleInputUrl<T extends IAllowedInput>(_input: T)
{
	if (typeof _input === 'number' || typeof _input === 'string' && /^\d+$/.test(_input))
	{
		let value: string = _input.toString();

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
	else if (_input instanceof LazyURL || _input instanceof URL)
	{
		let value = _input instanceof LazyURL ? _input : new LazyURL(_input);

		return {
			type: EnumParseInputUrl.URL as const,
			_input: _input as (T & LazyURL) | (T & URL),
			value,
		}
	}
	else if (_input instanceof LazyURLSearchParams || _input instanceof URLSearchParams)
	{
		let value = new LazyURLSearchParams(_input);

		return {
			type: EnumParseInputUrl.URLSEARCHPARAMS as const,
			_input,
			value,
		}
	}

	let value: string = String(_input);

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

export default _handleInputUrl
