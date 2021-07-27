/**
 * Created by user on 2020/3/3.
 */

import { ISitesKeys, ICachedJSONRowInput, ISitesSourcePack, IEntryHandler } from '../types';
import { newUUID, trim } from '../../util';
import sortObjectKeys from 'sort-object-keys2';
import { IArrayCachedJSONRow} from '../../../types';
import { toRecord } from '../../util/convert';
import { array_unique_overwrite } from 'array-hyper-unique';
import { ICachedJSONRowPlus, IRecordCachedJSONRow } from '@demonovel/cached-data-types';
import { expect } from 'chai';

export function newEntry<K extends ISitesKeys>(siteID: K, item: ICachedJSONRowInput)
{
	if (!item.uuid)
	{
		item.uuid = newUUID(siteID, item.id);
	}

	if (item.titles?.length)
	{
		array_unique_overwrite(item.titles)
	}

	item.siteID = siteID;

	item.updated = item.updated || 0;

	Object.entries(item)
		.forEach(([k, v]) =>
		{
			if (v && Array.isArray(v))
			{
				v = v.filter(v => Boolean(v) && String(v).length);
				// @ts-ignore
				if (v.length)
				{
					// @ts-ignore
					item[k] = v;
				}
				else
				{
					// @ts-ignore
					delete item[k]
				}
			}
			else if (typeof v === "string"
				&& k !== 'novelID'
				&& k !== 'id'
			)
			{
				// @ts-ignore
				item[k] = trim(v);
			}
		})
	;

	expect(item).to.have.property('novelID').an('string').lengthOf.at.least(1);
	expect(item).to.have.property('id').an('string').lengthOf.at.least(1);
	expect(item).to.have.property('chapters_num').an('number');

	return sortObjectKeys(item, {
		keys: [
			'siteID',
			'novelID',
			'uuid',
			'id',
			'title',
			'titles',
			'cover',
			'authors',
			'translator',
			'updated',
			'chapters_num',
			'last_update_name',
			'tags',
			'content',
		] as (keyof ICachedJSONRowInput)[],
		useSource: true,
	}) as ICachedJSONRowPlus;
}

export function newTitle(chapter_name?: string, volume_name?: string)
{
	let c = '／';
	let a: string[] = [];

	if (typeof volume_name === 'string' && volume_name.length)
	{
		a.push(volume_name)
	}

	if (typeof chapter_name === 'string' && chapter_name.length)
	{
		a.push(chapter_name)
	}

	if (a.length)
	{
		return a.join(c);
	}
}

export function handleEntries<K extends ISitesKeys>(siteID: K, source: ISitesSourcePack, handler: IEntryHandler)
{
	let list = Object.entries(source[siteID])
		.reduce((a, [id, data]) => {

			let item = handler(siteID as any, String(id), source[siteID][id]);

			//item && console.log(siteID, item.id, item.title);

			if (item && item.title.length)
			{
				a.push(item)
			}

			return a
		}, [] as IArrayCachedJSONRow)
		.filter(Boolean)
	;

	return toRecord(list)
}
