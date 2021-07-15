import { IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import { IDiscuzForumPickThreads } from 'discuz-api/lib/types';
import { IWenku8RecentUpdateRowBookWithChapters } from 'wenku8-api/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
import { ICachedJSONRow, ICachedJSONRowPlus } from '@demonovel/cached-data-types';

export const id_packs_map = {
	dmzj: '@node-novel/cached-dmzj/data/novel/info.pack.json',
	esjzone: '@node-novel/cached-esjzone/data/novel/info.pack.json',
	masiro: '@node-novel/cached-masiro/data/forum.pack.json',
	wenku8: '@node-novel/cached-wenku8/data/novel/info.pack.json',
};

export type ISitesKeys = keyof typeof id_packs_map;

export interface ISitesSourceType
{
	dmzj: IDmzjNovelInfoWithChapters,
	esjzone:IESJzoneRecentUpdateRowBook,
	masiro: IDiscuzForumPickThreads,
	wenku8: IWenku8RecentUpdateRowBookWithChapters,
}

export interface ISitesSourcePack
{
	dmzj: Record<string, IDmzjNovelInfoWithChapters>,
	esjzone: Record<string, IESJzoneRecentUpdateRowBook>,
	masiro: Record<string, IDiscuzForumPickThreads>,
	wenku8: Record<string, IWenku8RecentUpdateRowBookWithChapters>,
}

export const BASE_URL_GITHUB = 'https://github.com/bluelovers/ws-rest/raw/master/packages/';

export interface IFetchParams
{
	local?: boolean;
}

export type ICachedJSONRowInput = ITSRequireAtLeastOne<Partial<ICachedJSONRowPlus>, "id" | "title" | "novelID" >

export type IEntryHandler = (siteID: any, id: string, data: any) => ICachedJSONRowPlus

