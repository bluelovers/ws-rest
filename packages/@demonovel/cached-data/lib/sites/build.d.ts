import { ISitesKeys, ISitesSourcePack } from './types';
import { IRecordCachedJSONRow } from '../../types';
import Bluebird from 'bluebird';
export declare function buildCore<K extends ISitesKeys>(siteID: K, source: ISitesSourcePack): IRecordCachedJSONRow;
export declare function build(source: ISitesSourcePack): Bluebird<Record<"dmzj" | "esjzone" | "masiro" | "wenku8", IRecordCachedJSONRow>>;
export default buildCore;
