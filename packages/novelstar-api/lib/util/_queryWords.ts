import { INovelStarRecentUpdateOptions, INumberValue, IWordsObject } from '../types';
import { _parseInt } from './_parseInt';

export function _queryWords(min: INumberValue | INovelStarRecentUpdateOptions["words"], max?: INumberValue)
{
	if (typeof min === 'string' && min.includes('-'))
	{
		return min;
	}
	else if (min !== null && typeof min === 'object')
	{
		if (Array.isArray(min))
		{
			([min, max] = min);
		}
		else
		{
			({ min, max } = min);
		}
	}

	min = _parseInt(min as number);
	max = _parseInt(max);

	if (min || max)
	{
		return `${min ?? 0}-${max ?? ''}`;
	}
}

export function _parseWords(words: string)
{
	if (words === '')
	{
		return
	}

	let ls = words?.split('-')

	if (typeof words === 'undefined' || words === null || ls?.length === 2)
	{
		if (ls.length === 2)
		{
			let [min, max] = ls as any as number[];

			min = _parseInt(min);
			max = _parseInt(max);

			if (!min && !max)
			{
				throw new TypeError(`Invalid query words: ${words} = ${ls}`)
			}

			return {
				min,
				max,
			} as IWordsObject
		}

		return;
	}

	throw new TypeError(`Invalid query words: ${words}`)
}
