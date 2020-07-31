import { IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import { IDiscuzForumPickThreads } from 'discuz-api/lib/types';
import { IWenku8RecentUpdateRowBookWithChapters } from 'wenku8-api/lib/types';
import { ITSRequireAtLeastOne } from 'ts-type';
import { ICachedJSONRowPlus } from '../../types';
export declare const id_packs_map: {
    dmzj: string;
    esjzone: string;
    masiro: string;
    wenku8: string;
};
export declare type ISitesKeys = keyof typeof id_packs_map;
export interface ISitesSourceType {
    dmzj: IDmzjNovelInfoWithChapters;
    esjzone: IESJzoneRecentUpdateRowBook;
    masiro: IDiscuzForumPickThreads;
    wenku8: IWenku8RecentUpdateRowBookWithChapters;
}
export interface ISitesSourcePack {
    dmzj: Record<string, IDmzjNovelInfoWithChapters>;
    esjzone: Record<string, IESJzoneRecentUpdateRowBook>;
    masiro: Record<string, IDiscuzForumPickThreads>;
    wenku8: Record<string, IWenku8RecentUpdateRowBookWithChapters>;
}
export declare const BASE_URL_GITHUB = "https://github.com/bluelovers/ws-rest/raw/master/packages/";
export interface IFetchParams {
    local?: boolean;
}
export declare type ICachedJSONRowInput = ITSRequireAtLeastOne<Partial<ICachedJSONRowPlus>, "id" | "title" | "novelID">;
export declare type IEntryHandler = (siteID: any, id: string, data: any) => ICachedJSONRowPlus;
