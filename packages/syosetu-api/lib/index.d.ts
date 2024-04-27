import AbstractHttpClientWithJSDom, { IJSDOM } from 'restful-decorator-plugin-jsdom/lib';
import { ISyosetuApiNcodeRaw, ISyosetuApiParams, ISyosetuApiNcode, ISyosetuApiNcodeRawAll, ISyosetuApiNcode18Raw } from './types';
/**
 * @see https://syosetu.com/
 *
 * @see https://dev.syosetu.com/man/rankapi/
 * @see https://dev.syosetu.com/man/api/
 *
 * r18
 * @see https://dev.syosetu.com/xman/api/
 *
 *
 * @see https://github.com/59naga/naroujs
 * @see https://github.com/ErgoFriend/yomoujs
 */
export declare class SyosetuClient extends AbstractHttpClientWithJSDom {
    protected _constructor(): void;
    _syosetuApi<T>(apiPath: string, params: ISyosetuApiParams): Promise<import("axios").AxiosResponse<T>>;
    /**
     * ncode api raw json
     *
     * https://api.syosetu.com/novelapi/api/
     * https://api.syosetu.com/novel18api/api/
     */
    ncodeInfoRaw(ncode: string, novel18: true): Promise<ISyosetuApiNcode18Raw>;
    ncodeInfoRaw(ncode: string, novel18: false): Promise<ISyosetuApiNcodeRaw>;
    ncodeInfoRaw(ncode: string, novel18?: boolean): Promise<ISyosetuApiNcodeRawAll>;
    /**
     * ncode api json
     *
     * https://api.syosetu.com/novelapi/api/
     * https://api.syosetu.com/novel18api/api/
     */
    ncodeInfo(ncode: string, novel18: true): Promise<ISyosetuApiNcode<ISyosetuApiNcode18Raw>>;
    ncodeInfo(ncode: string, novel18: false): Promise<ISyosetuApiNcode<ISyosetuApiNcodeRaw>>;
    ncodeInfo(ncode: string, novel18?: boolean): Promise<ISyosetuApiNcode<ISyosetuApiNcodeRawAll>>;
    _getWebNovelRaw(argv: {
        novel_r18?: boolean;
        novel_id: string;
        chapter_id: string | number;
        protocol?: string;
    }): Promise<IJSDOM>;
    getChapter(argv: {
        novel_r18?: boolean;
        novel_id: string;
        chapter_id: string | number;
        protocol?: string;
    }, options?: {
        rawHtml?: boolean;
        cb?(data: {
            i: number;
            $elem: JQuery<HTMLElement>;
            $content: JQuery<HTMLElement>;
            src: string;
            imgs: string[];
        }): void;
    }): Promise<IJSDOM>;
}
export default SyosetuClient;
