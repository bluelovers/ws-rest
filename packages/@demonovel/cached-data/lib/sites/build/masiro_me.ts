/**
 * Created by user on 2020/3/3.
 */

import { ISitesSourceType, ICachedJSONRowInput } from '../types';
import { newTitle, newEntry } from './util';
import { createMomentBySeconds } from '../../util/moment';
import { EnumSiteID } from '@demonovel/cached-data-types';

let now = Date.now();

export function buildMasiroMe<K extends EnumSiteID.dmzj>(siteID: K,
	id: string,
	data: ISitesSourceType[EnumSiteID.masiro_me],
)
{

	let {
		id: novel_id,
			title,
			cover,
			authors,
			translator,
			tags,
			updated,
			status_text,
			last_update_name,
			content,
	} = data

	let item: ICachedJSONRowInput = {
		...data
	};

	item.novelID = data.id;

	// @ts-ignore
	delete item.chapters;

	return newEntry(siteID, item)
}

export default buildMasiroMe
