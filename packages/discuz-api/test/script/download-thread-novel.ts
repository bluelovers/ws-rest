/**
 * Created by user on 2019/12/22.
 */

import { parse, stringify } from '@node-novel/md-loader';
import path from "path";
import { setupDevClient, __root } from '../lib/index';
import LazyURL from 'lazy-url/lib';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import fs from 'fs-extra';
import { mdconf, IMdconfMeta } from 'node-novel-info';
import { IDiscuzThread, IDiscuzThreadPickRange } from '../../lib/types';
import Bluebird from 'bluebird';
import { getResponseUrl } from '@bluelovers/axios-util/lib';
import { array_unique_overwrite, array_unique } from 'array-hyper-unique';

export default (async () =>
{
	const { api, saveDevCacheFile } = await setupDevClient();

	await api.threadPosts({
			tid: 20993,
			authorid: 28,
		})
		.tap(thread => {
			console.dir(thread);
		})
		.tap(async function (this: typeof api, thread) {

			let targetDir = path.join(__root, 'test/temp', 'download', thread.tid);

			let md = await threadAttachToNodeNovel(thread, this.$baseURL);

			if (md)
			{
				await fs.outputFile(path.join(targetDir, `00000_null`, 'ATTACH.md'), md)
			}

			let data: IMdconfMeta = {
				novel: {
					title: thread.subject,
					source: `https://masiro.moe/forum.php?mod=viewthread&tid=${thread.tid}`,
				},
				contribute: [thread.author],
				link: [
					`https://masiro.moe/forum.php?mod=viewthread&tid=${thread.tid}`,
				]
			};

			await Bluebird.resolve(thread.posts)
				.each((post, idx) => {

					let id = (idx + 1).toString().padStart(4, '0') + '0';

					let file = path.join(targetDir, `00000_null`, `${id}_${post.pid}.txt`);

					data.contribute.push(post.author);

					return fs.outputFile(file, post.postmessage)
				})
				.tap(ls => {

					data.contribute = array_unique(data.contribute);

					return fs.outputFile(path.join(targetDir, 'README.md'), stringify({
						mdconf: data
					}));

				})
			;

		})
	;

	await saveDevCacheFile();

})();

function threadAttachToNodeNovel(thread: IDiscuzThreadPickRange, baseURL: string)
{
	if (thread.thread_attach && thread.thread_attach.img)
	{
		let images = Object
			.values(thread.thread_attach.img)
			.reduce((a, v) => {

				a[`aid_${v.aid}`] = new LazyURL(v.file, baseURL).toString();

				return a
			}, {} as Record<string, string>)
		;

		let md = stringify({
			mdconf: {
				attach: {
					images
				}
			}
		}, {
			stringify: mdconf.stringify,
		});

		return md
	}
}
