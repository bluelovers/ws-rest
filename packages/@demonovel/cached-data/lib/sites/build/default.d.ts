/**
 * Created by user on 2020/3/3.
 */
import { ISitesSourceType } from '../types';
import { EnumSiteID } from '@demonovel/cached-data-types';
export declare function buildDefault<K extends EnumSiteID.dmzj>(siteID: K, id: string, data: ISitesSourceType[EnumSiteID.dmzj] & ISitesSourceType[EnumSiteID.wenku8]): import("@demonovel/cached-data-types").ICachedJSONRowPlus;
export default buildDefault;
