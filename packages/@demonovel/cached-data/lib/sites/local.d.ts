import { ISitesKeys, ISitesSourcePack } from './types';
import Bluebird from 'bluebird';
export declare function fetch<K extends ISitesKeys>(siteID: K): Bluebird<ISitesSourcePack[K]>;
export declare function fetchFile<K extends ISitesKeys>(siteID: K, force?: boolean): Bluebird<ISitesSourcePack[K]>;
export default fetchFile;
