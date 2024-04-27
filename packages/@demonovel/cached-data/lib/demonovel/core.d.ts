import { INovelStatCache } from '@node-novel/cache-loader';
export declare function fetch(): import("bluebird")<INovelStatCache>;
export declare function fetchFile(force?: boolean): import("bluebird")<INovelStatCache>;
export default fetchFile;
