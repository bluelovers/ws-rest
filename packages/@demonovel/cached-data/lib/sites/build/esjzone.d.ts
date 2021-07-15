/**
 * Created by user on 2020/3/3.
 */
import { ISitesSourceType } from '../types';
import { EnumSiteID } from '@demonovel/cached-data-types';
export declare function buildEsjzone<K extends EnumSiteID.esjzone>(siteID: K, id: string, data: ISitesSourceType[K]): import("@demonovel/cached-data-types").ICachedJSONRowPlus;
export default buildEsjzone;
