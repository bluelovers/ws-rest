import { EnumOrder, INovelStarRecentUpdateOptions, INovelStarRecentUpdateOptionsRaw } from '../types';
import { _queryWords } from './_queryWords';
import { _queryTimes } from './_queryTimes';

export function _queryRecentUpdate(page?: number, extra?: INovelStarRecentUpdateOptions)
{
	if (typeof extra?.words !== 'undefined')
	{
		extra.words = _queryWords(extra.words)
	}

	if (typeof extra?.times !== 'undefined')
	{
		extra.times = _queryTimes(extra.times)
	}

	if (extra?.o === EnumOrder.hot)
	{
		delete extra.o
	}

	return [
		page,
		extra as INovelStarRecentUpdateOptionsRaw,
	] as const
}
