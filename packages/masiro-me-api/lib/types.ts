import { ICachedJSONRow } from '@demonovel/cached-data-types';
import { ICachedJSONRowPlus } from '@demonovel/cached-data-types/index';
import { ITSPartialPick } from 'ts-type/lib/type/record';

export interface IMasiroMeBook extends Omit<ICachedJSONRow, 'siteID' | 'novelID' | 'uuid'>, ITSPartialPick<ICachedJSONRowPlus, 'status'>
{
	translator?: string[],
}

export interface IMasiroMeChaptersParent
{
	volume_name: string,
	volume_order: number,
	chapters: IMasiroMeChaptersChild[],
}

export interface IMasiroMeChaptersChild
{
	chapter_id: string,
	chapter_name: string,
	chapter_order: number,
	chapter_updated: number,
}

export interface IMasiroMeBookWithChapters extends IMasiroMeBook
{
	chapters: IMasiroMeChaptersParent[]
}

export interface IMasiroMeChapter
{
	chapter_id: string;
	imgs: string[];
	text: string;
	html?: string;

	chapter_name?: string;
	author?: string;
	dateline?: number;

	extra_info?: any,
}
