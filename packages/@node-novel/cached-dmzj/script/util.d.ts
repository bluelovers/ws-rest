/**
 * Created by user on 2019/7/7.
 */
import { DmzjClient } from 'dmzj-api';
import { console, consoleDebug } from '@node-novel/site-cache-util/lib';
export { consoleDebug, console };
import { __root } from './util/files';
export { __root };
export declare function getApiClient(): Promise<{
    api: DmzjClient;
    saveCache: () => void;
}>;
export { getApiClient as getDmzjClient };
export declare function trim(input: string): string;
