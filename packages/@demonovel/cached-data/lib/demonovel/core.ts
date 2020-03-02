/**
 * Created by user on 2020/3/2.
 */
import fetchCache from '../util/fetch';
import { readJSONWithFetch } from '../util/fs';
import { file, url } from './types';
import { INovelStatCache } from '@node-novel/cache-loader';

export function fetch()
{
	return fetchCache<INovelStatCache>(url, file)
}

export function fetchFile(force?: boolean)
{
	return readJSONWithFetch<INovelStatCache>(file, fetch, force)
}

export default fetchFile
