import fetchCache from '../util/fetch';
import { readJSONWithFetch } from '../util/fs';
import { ISitesKeys, ISitesSourcePack } from './types';
import Bluebird from 'bluebird';
import { _handleOptions } from './util';
import { readJSON } from 'fs-extra';

export function fetch<K extends ISitesKeys>(siteID: K): Bluebird<ISitesSourcePack[K]>
{
	let { url, file, file2 } = _handleOptions(siteID)

	return fetchCache(url, file);
}

export function fetchFile<K extends ISitesKeys>(siteID: K, force?: boolean): Bluebird<ISitesSourcePack[K]>
{
	let { url, file } = _handleOptions(siteID)

	return readJSONWithFetch(file, () => fetch(siteID), force)
}

export default fetchFile
