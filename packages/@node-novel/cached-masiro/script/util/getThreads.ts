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

	return api.forumThreads(threadOptions, {
		async next(cur: IDiscuzForum, forum: IDiscuzForum)
		{
			let oldExists: number;

			//consoleDebug.debug('page:', cur.page);

			if (typeof cacheForum === 'undefined')
			{
				cacheForum = await readJSON(extraOptions.cacheFileInfoPath(threadOptions.fid)).catch(e => null);

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

			let i = 0;
			let len = cur.threads.length;

			let bool = !cur.threads.every(v => {

				let old = cacheThreads[v.tid];
				let isNotExists = typeof old === 'undefined';

				let bool = deepEql(v, old);

				if (!bool)
				{
					if (typeof oldExists === 'undefined' && isNotExists)
					{
						i++;
						bool = true;
					}
//					else if (oldExists)
//					{
//						oldExists++;
//					}
					else if (oldExists < 2)
					{
						oldExists = 2;
					}
				}
//				else if (oldExists)
//				{
//					oldExists++
//				}
//				else if (typeof oldExists === 'undefined')
//				{
//					oldExists = 1;
//				}
				else if (!oldExists)
				{
					oldExists = 1;
				}

				if (!oldExists && !isNotExists)
				{
					oldExists = 0;
				}

				//console.log(bool, oldExists);

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

			if (i === len)
			{
				bool = true;
			}

			if (!bool)
			{
				if (i > 0)
				{
					consoleDebug.debug(`fid: ${forum.fid} 發現 threads 增加，但其他相同，略過檢查後續頁數 (${cur.page} / ${cur.pages})`);
				}
				else
				{
					consoleDebug.debug(`fid: ${forum.fid} 沒有發現 threads 變化，略過檢查後續頁數 (${cur.page} / ${cur.pages})`);
				}

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
