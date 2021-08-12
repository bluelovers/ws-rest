import { INumberValue } from '../types';

export function _parseInt(n: INumberValue): number
{
	if (typeof n === 'string' || typeof n === 'undefined' || n === null)
	{
		// @ts-ignore
		if (!n?.length)
		{
			n = void 0
		}
		else
		{
			n = Number.parseInt(n as string)
		}
	}

	if (typeof n === 'number' || typeof n === 'undefined')
	{
		if (!n)
		{
			return void 0
		}

		return n;
	}

	throw new TypeError(`Invalid number: ${n}`)
}
