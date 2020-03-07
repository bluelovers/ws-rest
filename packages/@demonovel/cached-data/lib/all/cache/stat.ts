import { IArrayCachedJSONRow } from '../../../types';
import { outputJSON } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../../__root';

export function buildCachedStat(list: IArrayCachedJSONRow)
{
	let total = list.length;

	let firstEntry = list[0];
	let updated = firstEntry.updated;

	let out = {
		timestamp: Date.now(),
		total,
		//firstEntry,
		updated,
	}

	return outputJSON(join(__rootCache, `stat.json`), out, {
		spaces: 2,
	})
}

export default buildCachedStat
