/**
 * Created by user on 2020/3/3.
 */
import { EnumSiteID } from '../../../types';
import { ISitesSourceType } from '../types';
export declare function buildEsjzone<K extends EnumSiteID.esjzone>(siteID: K, id: string, data: ISitesSourceType[K]): import("../../../types").ICachedJSONRowPlus;
export default buildEsjzone;
