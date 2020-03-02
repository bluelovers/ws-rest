import fetchCache from '../util/fetch';
import { readJSONWithFetch } from '../util/fs';
import { ISitesKeys, ISitesSourcePack } from './types';
import Bluebird from 'bluebird';
import { _handleOptions } from './util';
import { copy, readJSON } from 'fs-extra';

export function fetch<K extends ISitesKeys>(siteID: K): Bluebird<ISitesSourcePack[K]>
{
	let { url, file, file2 } = _handleOptions(siteID)

	return Bluebird.resolve()
		.then(v => copy(require.resolve(file2), file, {
			dereference: true,
			overwrite: true,
			preserveTimestamps: true,
		}))
		.then(v => readJSON(file))
	;
}

export function fetchFile<K extends ISitesKeys>(siteID: K, force?: boolean): Bluebird<ISitesSourcePack[K]>
{
	return fetch(siteID)
}

export default fetchFile
