import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import { AxiosResponse } from 'axios';
import { IESJzoneChapterFromPasswordReturnRaw } from '../types';
import { IJSDOM } from 'restful-decorator-plugin-jsdom';
export declare function _handleChapterFromPasswordReturnRaw(json: IESJzoneChapterFromPasswordReturnRaw): IESJzoneChapterFromPasswordReturnRaw;
export declare function _parseSiteLinkChapterFromPasswordReturn<T extends AbstractHttpClientWithJSDom>(api: T, json: IESJzoneChapterFromPasswordReturnRaw, response?: AxiosResponse<any>): {
    jsdom: IJSDOM;
    response: AxiosResponse<any>;
};
