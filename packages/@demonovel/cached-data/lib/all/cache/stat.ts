import { IArrayCachedJSONRow, ICacheStat } from '../../../types';
import { outputJSON } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../../__root';
import { outputJSONWithIndent } from '../../util/fs';

export function buildCachedStat(list: IArrayCachedJSONRow)
{
	let total = list.length;

	let firstEntry = list[0];
	let updated = firstEntry.updated;

	let out: ICacheStat = {
		timestamp: Date.now(),
		total,
		updated,
	};

	return outputJSONWithIndent<ICacheStat>(join(__rootCache, `stat.json`), out)
}

export default buildCachedStat
