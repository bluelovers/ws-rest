/**
 * Created by user on 2020/3/3.
 */

import { ISitesSourceType, ICachedJSONRowInput } from '../types';
import { newTitle, newEntry } from './util';
import { createMomentBySeconds } from '../../util/moment';
import { EnumSiteID } from '@demonovel/cached-data-types';

let now = Date.now();

export function buildDefault<K extends EnumSiteID.dmzj>(siteID: K,
	id: string,
	data: ISitesSourceType[EnumSiteID.dmzj] & ISitesSourceType[EnumSiteID.wenku8],
)
{
	let item: ICachedJSONRowInput = {} as any;

	item.id = id;
	item.novelID = id;
	item.title = data.name;
	item.authors = [data.authors];
	item.content = data.desc || data.introduction;
	item.tags = data.types || data.tags;
	item.updated = data.last_update_time && createMomentBySeconds(data.last_update_time).valueOf() || 0;
	item.cover = data.cover;

	item.last_update_name = newTitle(data.last_update_chapter_name, data.last_update_volume_name);

	item.chapters_num = data.chapters && data.chapters.reduce((i, v) =>
	{

		i += v.chapters.length;

		return i
	}, 0);

	return newEntry(siteID, item)
}

export default buildDefault
