import { ISitesSourcePack, IFetchParams } from './types';
import Bluebird from 'bluebird';
export declare function fetch(opts?: IFetchParams): Bluebird<ISitesSourcePack>;
export declare function fetchFile(force?: boolean, opts?: IFetchParams): Bluebird<ISitesSourcePack>;
export default fetchFile;
