import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IESJzoneRecentUpdateCache, IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug, __root } from '../util';
import FastGlob, { Options, EntryItem } from '@bluelovers/fast-glob/bluebird';
import path from 'upath2';
import { zhDictCompare, getCjkName } from '@novel-segment/util';
import sortObject from 'sort-object-keys2';

import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { IDiscuzForum } from 'discuz-api/lib/types';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';

export default lazyRun(async () =>
{
	consoleDebug.info(`building... subForums, topForums`);

	let allForums = await readJSON(cacheFilePaths.infoPack).then(v => Object.values(v)) as IDiscuzForum[];

	let subForums: Record<string, (Pick<IDiscuzForum, 'fid' | 'forum_name' | 'last_thread_time' | 'last_thread_subject' | 'last_thread_id' | 'pages' | 'moderator' | 'forum_rules'> & {
		threads_length: number,
	})> = {};

	let topForums: Record<string, (Pick<IDiscuzForum, 'fid' | 'forum_name' | 'subforums'>)> = {};

	allForums.forEach(b =>
	{
		if (b.subforums && b.subforums.length)
		{
			let {
				fid,
				forum_name,
				subforums,
			} = b;

			topForums[b.fid] = {
				fid,
				forum_name,
				subforums,
			};
		}
		else
		{
			let {
				fid,
				forum_name,

				last_thread_time,
				last_thread_subject,
				last_thread_id,

				pages,

				moderator,

				forum_rules,

				threads,
			} = b;

			subForums[b.fid] = {
				fid,
				forum_name,

				last_thread_time,
				last_thread_subject,
				last_thread_id,

				pages,
				threads_length: threads.length,

				moderator,

				forum_rules,
			};
		}

	});

	await Bluebird.all([
		outputJSONLazy(cacheFilePaths.subforums, subForums),
		outputJSONLazy(cacheFilePaths.topforums, topForums),
	]);

}, {
	pkgLabel: __filename,
});
