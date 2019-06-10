import LazyURL from 'lazy-url';
export declare type IUrlLike = string | URL | LazyURL;
export declare function urlNormalize2(input: IUrlLike): string;
export declare function urlNormalize(input: IUrlLike): string;
export default urlNormalize;
