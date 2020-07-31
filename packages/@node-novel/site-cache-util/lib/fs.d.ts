import { WriteOptions as IJSONWriteOptions } from 'fs-extra';
import Bluebird from 'bluebird';
export declare const outputJSONOptions: IJSONWriteOptions;
export declare function outputJSONLazy(file: string, data: any, options?: IJSONWriteOptions): Bluebird<void>;
