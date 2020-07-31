/**
 * Created by user on 2019/6/10.
 */
/// <reference types="node" />
import LazyCookie from '../../index';
import toughCookie from 'tough-cookie';
export declare function parse(line: string): LazyCookie;
export declare function parseFile(input: string | Buffer): LazyCookie[];
export declare function stringify(cookie: LazyCookie | toughCookie.Cookie, skipInvalid?: boolean): string;
export default parseFile;
