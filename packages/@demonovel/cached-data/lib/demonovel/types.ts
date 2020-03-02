import { siteIDCachedSourceFile } from '../util/files';
import { INovelStatCache, IFilterNovelData } from '@node-novel/cache-loader';

export type ISitesKeys = 'demonovel';
export let url = `https://gitlab.com/novel-group/txt-source/raw/master/novel-stat.json`;
export const siteID = 'demonovel' as const;
export const file = siteIDCachedSourceFile(siteID);

export interface ISitesSourcePack
{
	demonovel: INovelStatCache
}

export interface IFilterNovelDataPlus extends IFilterNovelData
{
	title: string
	authors: string[]
}
