import type { ISitesKeys as ISitesKeys1, ISitesSourcePack as ISitesSourcePack1 } from './lib/sites/types';
import type { ISitesKeys as ISitesKeys2, ISitesSourcePack as ISitesSourcePack2 } from './lib/demonovel/types';

export enum EnumSiteID
{
	'dmzj' = 'dmzj',
	'esjzone' = 'esjzone',
	'demonovel' = 'demonovel',
	'masiro' = 'masiro',
	'wenku8' = 'wenku8',
}

export type ISitesKeysAll = ISitesKeys1 | ISitesKeys2 | EnumSiteID;

export interface ISitesSourcePackAll extends ISitesSourcePack1, ISitesSourcePack2
{

}

export interface ICachedJSONRow
{
	siteID: string | EnumSiteID;
	novelID: string;
	uuid: string;
	id: string;
	title: string;
	subtitle?: string;
	cover?: string;
	authors?: string[];
	updated: number;
	chapters_num?: number;
	last_update_name?: string;
	tags?: string[];
	content: string;
}

export interface ICachedJSONRowPlus extends ICachedJSONRow
{
	pathMain: string;
	pathMain_real: string;
	titles: string[];
	epub_basename: string;
}

export interface IRecordCachedJSONRow extends Record<string, ICachedJSONRow | ICachedJSONRowPlus>
{

}

export type IArrayCachedJSONRow = (ICachedJSONRowPlus)[]

export interface IRecordSitesBuildAll extends Record<ISitesKeysAll, IRecordCachedJSONRow>, Record<string, IRecordCachedJSONRow>, Record<EnumSiteID, IRecordCachedJSONRow>
{

}
