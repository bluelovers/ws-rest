import { ISitesKeys, id_packs_map, ISitesSourcePack, IFetchParams } from './types';
import _fetchFile, { fetch as _fetch } from './core';
import _fetchFileLocal from './local';

import Bluebird from 'bluebird';
import { _handleOptions } from './util';

export function fetch(opts: IFetchParams = {}): Bluebird<ISitesSourcePack>
{
	return Bluebird
		.resolve(Object.keys(id_packs_map) as ISitesKeys[])
		.reduce(async (a, siteID) => {
			if (opts.local)
			{
				a[siteID] = await _fetchFileLocal(siteID)
			}
			else
			{
				a[siteID] = await _fetch(siteID)
					.timeout(5000)
					.catch(e => _fetchFileLocal(siteID))
			}

			return a

		}, {} as any)
}

export function fetchFile(force?: boolean, opts?: IFetchParams): Bluebird<ISitesSourcePack>
{
	return Bluebird
		.resolve(Object.keys(id_packs_map) as ISitesKeys[])
		.reduce(async (a, siteID) => {
			if (opts.local)
			{
				a[siteID] = await _fetchFileLocal(siteID)
			}
			else
			{
				a[siteID] = await _fetchFile(siteID, force)
					.timeout(5000)
					.catch(e => _fetchFileLocal(siteID))
			}

			return a;
		}, {} as any)
}

export default fetchFile
