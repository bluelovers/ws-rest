/**
 * Created by user on 2020/3/3.
 */
import { ISitesSourceType } from '../types';
import { EnumSiteID } from '@demonovel/cached-data-types';
export declare function buildMasiroMe<K extends EnumSiteID.dmzj>(siteID: K, id: string, data: ISitesSourceType[EnumSiteID.masiro_me]): import("@demonovel/cached-data-types").ICachedJSONRowPlus;
export default buildMasiroMe;
