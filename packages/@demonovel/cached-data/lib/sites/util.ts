/**
 * Created by user on 2020/3/2.
 */

import { ISitesKeys, id_packs_map, BASE_URL_GITHUB } from './types';
import { siteIDCachedSourceFile } from '../util/files';

export function _handleOptions<K extends ISitesKeys>(siteID: K)
{
	let url = new URL(id_packs_map[siteID], BASE_URL_GITHUB).href;

	let file = siteIDCachedSourceFile(siteID);

	let file2 = id_packs_map[siteID];

	return {
		url,
		file,
		file2,
	}
}
