/**
 * Created by user on 2019/12/13.
 */

import { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged } from '@git-lazy/diff-staged';
import matchGlob from '@git-lazy/util/util/match';
import { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';

export { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged }
export { matchGlob }
export { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns }
import { join, parse as parsePath } from 'path';
import Bluebird from 'bluebird';
import { readJSON } from 'fs-extra';
import moment from 'moment';
import { ITSResolvable } from 'ts-type';

export function filterGitDiffStagedFiles(options: {
	git_root: string,
	pattern?: string[],
})
{
	return Bluebird.resolve()
		.then(async () =>
		{
			let ls1 = gitDiffStagedFile(options.git_root);

			options.pattern = options.pattern || [
				'novel/info/*.json',
			];

			let ls3 = matchGlob(ls1, options.pattern);

			return ls3
		})
	;
}

export function reportDiffStagedNovels<T extends object>(options: {
	git_root: string,
	pattern?: string[],
	callback?(json: T, id: string): ITSResolvable<string>,
})
{
	return Bluebird.resolve()
		.then(async () =>
		{
			let ls3 = await filterGitDiffStagedFiles(options);

			let msg = '';

			if (ls3.length)
			{
				options.callback = options.callback || ((json: any, id) =>
				{

					return `- ${id.padStart(4, '0')} ${json.name} ${moment.unix(json.last_update_time)
						.format()} ${json.last_update_volume_name} ${json.last_update_chapter_name}`

				});

				msg = await Bluebird
					.resolve(ls3)
					.reduce(async (a, filename) =>
					{

						let file = join(options.git_root, filename);
						let id = parsePath(filename).name;

						let json = await readJSON(file);

						let line = await options.callback(json, id);

						a.push(line);

						return a;
					}, [`, novel x ${ls3.length}\n`] as string[])
					.then(a => a.join('\n'))
				;
			}

			return msg;
		})
		;
}
