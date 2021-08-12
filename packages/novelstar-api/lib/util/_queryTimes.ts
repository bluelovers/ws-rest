import { EnumTimesUnit, INovelStarRecentUpdateOptions } from '../types';
import { _parseInt } from './_parseInt';

export function _queryTimes(times: INovelStarRecentUpdateOptions["times"], unit?: EnumTimesUnit | string): string
{
	if (times !== null && typeof times === 'object')
	{
		if (Array.isArray(times))
		{
			([times, unit] = times);
		}
		else
		{
			throw new TypeError(`Invalid times: ${times}`)
		}
	}

	if (typeof times === 'string' && /\D/.test(times as string))
	{
		return times;
	}

	times = _parseInt(times as number);

	if (times)
	{
		return `${times} ${unit || EnumTimesUnit.days}`
	}
}
