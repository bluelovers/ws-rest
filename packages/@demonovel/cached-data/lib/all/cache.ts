import { IArrayCachedJSONRow } from '../../types';
import buildCachedTitle from './cache/title';
import Bluebird from 'bluebird';
import buildCachedStat from './cache/stat';
import buildCachedByDate from './cache/byDate';
import buildCachedAuthors from './cache/author';

export async function buildCached(list: IArrayCachedJSONRow)
{
	return Bluebird.all([
		buildCachedTitle(list),
		buildCachedStat(list),
		buildCachedByDate(list),
		buildCachedAuthors(list),
	])
}

export default buildCached
