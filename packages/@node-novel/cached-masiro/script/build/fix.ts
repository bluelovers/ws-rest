/**
 * Created by user on 2019/11/24.
 */
import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IESJzoneRecentUpdateCache } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug, getApiClient } from '../util';

export default (async () =>
{
	const { api, saveCache } = await getApiClient();



})();
