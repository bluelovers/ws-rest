/**
 * Created by user on 2020/3/3.
 */
import { EnumSiteID } from '../../../types';
import { ISitesSourceType } from '../types';
export declare function buildDefault<K extends EnumSiteID.dmzj>(siteID: K, id: string, data: ISitesSourceType[EnumSiteID.dmzj] & ISitesSourceType[EnumSiteID.wenku8]): import("../../../types").ICachedJSONRowPlus;
export default buildDefault;
