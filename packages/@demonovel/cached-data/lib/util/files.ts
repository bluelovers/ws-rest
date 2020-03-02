import { join } from "path";
import { ISitesKeysAll } from '../types';
import { __rootCacheSource } from '../__root';

export function siteIDCachedSourceFile<K extends ISitesKeysAll>(siteID: K)
{
	let file = join(__rootCacheSource, `./${siteID}.json`);

	return file;
}
