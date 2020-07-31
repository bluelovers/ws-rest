/**
 * Created by user on 2019/7/7.
 */
import { Wenku8Client as ApiClient } from 'wenku8-api';
import { console, consoleDebug } from '@node-novel/site-cache-util/lib';
export { consoleDebug, console };
import { __root } from './util/files';
export { __root };
export declare function getApiClient(): Promise<{
    api: ApiClient;
    saveCache: () => void;
}>;
export declare function trim(input: string): string;
