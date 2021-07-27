/**
 * Created by user on 2019/7/7.
 */
import { lazyImport, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { pkgLabel } from './util/main';
import { basename, dirname } from 'path';
import { cacheFileInfoPath } from './util/files';
import { IMasiroMeBookWithChapters } from 'masiro-me-api/lib/types';
import { readJSON, pathExists } from 'fs-extra';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import { _sortBookFields } from 'masiro-me-api/lib/util/_sortBookFields';

export default lazyRun(async () => {

	await FastGlob.async([
			'*.json',
		], {
			cwd: dirname(cacheFileInfoPath(1)),
			absolute: true,
		})
		.mapSeries(async (_file, index, length) =>
		{
			const novel: IMasiroMeBookWithChapters = await readJSON(_file);

			let keys = Object.keys(novel)

			_sortBookFields(novel);

			if (Object.keys(novel).some((value, index) => {
				return value !== keys[index];
			}))
			{
				return outputJSONLazy(_file, novel)
			}
		})
	;

}, {
	pkgLabel: __filename,
});
