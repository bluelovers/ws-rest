import type { ISitesKeys as ISitesKeys1, ISitesSourcePack as ISitesSourcePack1 } from './lib/sites/types';
import type { ISitesKeys as ISitesKeys2, ISitesSourcePack as ISitesSourcePack2 } from './lib/demonovel/types';
import { EnumSiteID, ICachedJSONRowPlus, IRecordCachedJSONRow } from '@demonovel/cached-data-types';
export { EnumSiteID, ICachedJSONRowPlus, IRecordCachedJSONRow } from '@demonovel/cached-data-types';
export type ISitesKeysAll = ISitesKeys1 | ISitesKeys2 | EnumSiteID;
export interface ISitesSourcePackAll extends ISitesSourcePack1, ISitesSourcePack2 {
}
export type IArrayCachedJSONRow = (ICachedJSONRowPlus)[];
export interface IRecordSitesBuildAll extends Record<ISitesKeysAll, IRecordCachedJSONRow>, Record<string, IRecordCachedJSONRow>, Record<EnumSiteID, IRecordCachedJSONRow> {
}
export type IPresetTitlesRow = [string, string[]];
export type IPresetTitles = IPresetTitlesRow[];
export interface IPresetDate {
    [Date: string]: string[];
}
export interface ICacheStat {
    "timestamp": number;
    "total": number;
    "updated": number;
}
