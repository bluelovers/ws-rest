import Bluebird from 'bluebird';
import { INovelStatCache } from '@node-novel/cache-loader';
export declare function fetch(): Bluebird<{
    demonovel: INovelStatCache;
}>;
export declare function fetchFile(force?: boolean): Bluebird<{
    demonovel: INovelStatCache;
}>;
export default fetchFile;
