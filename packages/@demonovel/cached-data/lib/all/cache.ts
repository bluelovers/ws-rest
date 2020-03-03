import { IArrayCachedJSONRow } from '../../types';
import buildCachedTitle from './cache/title';

export async function buildCached(list: IArrayCachedJSONRow)
{
	await buildCachedTitle(list)
}

export default buildCached
