/**
 * Created by user on 2020/1/20.
 */
import DiscuzClient from 'discuz-api/lib';
import { cacheFileInfoPath } from './files';
import { IDiscuzForum, IDiscuzForumPickThreads, IDiscuzForumThread } from 'discuz-api/lib/types';
import { readJSON } from 'fs-extra';
import dotValue from '@bluelovers/axios-util/lib';
// @ts-ignore
import deepEql from 'deep-eql';
import uniqBy from 'lodash/uniqBy';
import { __root, getApiClient, console, consoleDebug } from '../util';

export function getThreadsByFid<API extends DiscuzClient>(api: API, threadOptions: {
	fid: string
}, extraOptions: {
	cacheFileInfoPath: (id: string | number) => string,
})
{
	let cacheForum: IDiscuzForumPickThreads;
	let cacheThreads: Record<string, IDiscuzForumThread>;
	let oldExists: boolean;

	return api.forumThreads(threadOptions, {
		async next(cur: IDiscuzForum, forum: IDiscuzForum)
		{
			if (typeof cacheForum === 'undefined')
			{
				cacheForum = await readJSON(cacheFileInfoPath(threadOptions.fid)).catch(e => null);

				if (cacheForum == null)
				{
					cacheForum = null;
				}
				else
				{
					cacheThreads = cacheForum.threads.reduce((a, v) => {

						a[v.tid] = v;

						return a;
					}, {} as typeof cacheThreads)
				}
			}
			else if (cacheForum === null)
			{
				return true;
			}

			let bool = !cur.threads.every(v => {

				let old = cacheThreads[v.tid];

				if (typeof old !== 'undefined')
				{
					oldExists = true;
				}
				else if (!oldExists)
				{
					return true;
				}

				let bool = deepEql(v, old);

//				if (!bool && typeof old !== 'undefined')
//				{
//					console.dir({
//						bool,
//						old,
//						v,
//					})
//				}

				return bool;
			});

			if (!bool)
			{
				consoleDebug.debug(`fid: ${forum.fid} 沒有發現 threads 變化，略過檢查後續頁數 (${cur.page} / ${cur.pages})`);

				forum.threads = uniqBy(forum.threads.concat(cacheForum.threads), 'tid');
			}
			else
			{
				//consoleDebug.debug(`fid: ${forum.fid} (${cur.page} / ${cur.pages})`);
			}

			return bool;
		}
	})
}

export default getThreadsByFid
