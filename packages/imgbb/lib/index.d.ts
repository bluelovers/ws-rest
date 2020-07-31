/// <reference types="node" />
import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import { IBluebird } from 'restful-decorator/lib/index';
declare const SymApiOptions: unique symbol;
export interface ICaiyunFanyiOptions {
    token: string;
    defaults?: AxiosRequestConfig;
}
interface IImgBBUpload {
    data: {
        id: string;
        url_viewer: string;
        url: string;
        display_url: string;
        title: string;
        time: string;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
            size: number;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
            size: number;
        };
        delete_url: string;
    };
    success: boolean;
    status: number | 200;
}
export declare class ImgBB extends AbstractHttpClient {
    [SymApiOptions]: ICaiyunFanyiOptions;
    constructor(options: ICaiyunFanyiOptions);
    protected _init(defaults?: AxiosRequestConfig, options?: ICaiyunFanyiOptions, ...argv: any): any;
    setAccessToken(accessToken: string): this;
    /**
     * API v1 calls can be done using the POST or GET request methods but since GET request are limited by the maximum allowed length of an URL you should prefer the POST request method.
     */
    upload(jsonData: {
        key?: string;
        /**
         * The name of the file, this is automatically detected if uploading a file with a POST and multipart / form-data
         */
        name?: string;
        /**
         * A binary file, base64 data, or a URL for an image. (up to 16MB)
         */
        image: string | Buffer;
    }): IBluebird<IImgBBUpload>;
}
export default ImgBB;
