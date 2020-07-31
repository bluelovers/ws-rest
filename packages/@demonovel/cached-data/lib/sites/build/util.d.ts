/**
 * Created by user on 2020/3/3.
 */
import { ISitesKeys, ICachedJSONRowInput, ISitesSourcePack, IEntryHandler } from '../types';
import { ICachedJSONRowPlus, IRecordCachedJSONRow } from '../../../types';
export declare function newEntry<K extends ISitesKeys>(siteID: K, item: ICachedJSONRowInput): ICachedJSONRowPlus;
export declare function newTitle(chapter_name?: string, volume_name?: string): string;
export declare function handleEntries<K extends ISitesKeys>(siteID: K, source: ISitesSourcePack, handler: IEntryHandler): IRecordCachedJSONRow;
