import { IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import { IDiscuzForumPickThreads } from 'discuz-api/lib/types';
import { IWenku8RecentUpdateRowBookWithChapters } from 'wenku8-api/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
import { ICachedJSONRowPlus } from '@demonovel/cached-data-types';
import { IMasiroMeBookWithChapters } from 'masiro-me-api/lib/types';
export declare const id_packs_map: {
    dmzj: string;
    esjzone: string;
    masiro: string;
    wenku8: string;
    masiro_me: string;
};
export type ISitesKeys = keyof typeof id_packs_map;
export interface ISitesSourceType {
    dmzj: IDmzjNovelInfoWithChapters;
    esjzone: IESJzoneRecentUpdateRowBook;
    masiro: IDiscuzForumPickThreads;
    wenku8: IWenku8RecentUpdateRowBookWithChapters;
    masiro_me: IMasiroMeBookWithChapters;
}
export interface ISitesSourcePack {
    dmzj: Record<string, IDmzjNovelInfoWithChapters>;
    esjzone: Record<string, IESJzoneRecentUpdateRowBook>;
    masiro: Record<string, IDiscuzForumPickThreads>;
    wenku8: Record<string, IWenku8RecentUpdateRowBookWithChapters>;
    masiro_me: Record<string, IMasiroMeBookWithChapters>;
}
export declare const BASE_URL_GITHUB = "https://github.com/bluelovers/ws-rest/raw/master/packages/";
export interface IFetchParams {
    local?: boolean;
}
export type ICachedJSONRowInput = ITSRequireAtLeastOne<Partial<ICachedJSONRowPlus>, "id" | "title" | "novelID">;
export type IEntryHandler = (siteID: any, id: string, data: any) => ICachedJSONRowPlus;
