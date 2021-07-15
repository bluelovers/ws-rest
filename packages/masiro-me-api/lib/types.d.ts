import { ICachedJSONRow } from '@demonovel/cached-data-types';
import { ICachedJSONRowPlus } from '@demonovel/cached-data-types/index';
import { ITSPartialPick } from 'ts-type/lib/type/record';
export interface IMasiroMeBook extends Omit<ICachedJSONRow, 'siteID' | 'novelID' | 'uuid'>, ITSPartialPick<ICachedJSONRowPlus, 'status'> {
    translator?: string[];
}
