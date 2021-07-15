import { INovelStatCache } from '@node-novel/cache-loader';
import Bluebird from 'bluebird';
import { IRecordCachedJSONRow } from '@demonovel/cached-data-types';
export declare function build(source: INovelStatCache): Bluebird<IRecordCachedJSONRow>;
export default build;
