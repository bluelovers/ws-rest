import fetchCache from '../util/fetch';
import { readJSONWithFetch } from '../util/fs';
import _fetchFile, { fetch as _fetch } from './core';
import Bluebird from 'bluebird';
import { siteID } from './types';
import { INovelStatCache } from '@node-novel/cache-loader';

export function fetch()
{
	return Bluebird.props({
		[siteID]: _fetch(),
	})
}

export function fetchFile(force?: boolean)
{
	return Bluebird.props({
		[siteID]: _fetchFile(force),
	})
}

export default fetchFile
