/**
 * Created by user on 2020/3/2.
 */
import { WriteOptions } from 'fs-extra';
import Bluebird from 'bluebird';
export declare function readJSONWithFetch<T>(file: string, fetch: () => Promise<T>, force?: boolean): Bluebird<T>;
export declare function outputJSONWithIndent<T = any>(file: string, data: T, options?: WriteOptions): Bluebird<void>;
