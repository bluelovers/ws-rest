/**
 * Created by user on 2020/3/2.
 */
import { ISitesKeys } from './types';
export declare function _handleOptions<K extends ISitesKeys>(siteID: K): {
    url: string;
    file: string;
    file2: {
        dmzj: string;
        esjzone: string;
        masiro: string;
        wenku8: string;
    }[K];
};
