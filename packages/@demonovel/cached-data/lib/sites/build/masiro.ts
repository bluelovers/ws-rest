/**
 * Created by user on 2020/3/3.
 */

import { EnumSiteID } from '../../types';
import { ISitesSourceType, ICachedJSONRowInput } from '../types';
import { newTitle, newEntry } from './util';
import cheerio from "cheerio";

export function buildMasiro<K extends EnumSiteID.masiro>(siteID: K, id: string, data: ISitesSourceType[K])
{
	if (data.subforums && data.subforums.length)
	{
		return null;
	}

	let item: ICachedJSONRowInput = {} as any;

	item.id = id;
	item.novelID = id;

	item.title = data.forum_name;

	item.chapters_num = data.threads.length;

	try
	{
		item.content = data.forum_rules;
		item.content = item.content && cheerio.load(`<body>${item.content}</body>`)(`body`).text();
	}
	catch (e)
	{

	}

	item.updated = data.last_thread_time;

	if (data.threads[0])
	{
		let typeid = data.threads[0].typeid;

		item.last_update_name = newTitle(data.threads[0].subject, data.thread_types && data.thread_types[typeid]);
	}

	return newEntry(siteID, item)
}

export default buildMasiro
