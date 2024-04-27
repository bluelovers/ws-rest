import path from 'upath2';
import { ITSResolvable } from 'ts-type';
import Bluebird from 'bluebird';
import { console, consoleDebug } from 'restful-decorator/lib/util/debug';
import './moment';
export { path };
export { console, consoleDebug };
export declare function lazyImport<T = any>(name: string, _require: typeof require): Bluebird<T>;
export declare function lazyRun<T>(cb: (...argv: any) => ITSResolvable<T>, options: {
    pkgLabel: string;
}): Bluebird<T>;
