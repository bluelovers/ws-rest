export declare function createPkgPath(__root: string): {
    readonly __root: string;
    join(paths_0: string, ...paths: string[]): string;
    resolve(paths_0: string, ...paths: string[]): string;
    relative(paths_0: string): string;
};
export type ICreatePkgPath = ReturnType<typeof createPkgPath>;
export type ICreatePkgCachePathFunction<T extends ICreatePkgPath = ICreatePkgPath> = ((this: T, ...argv: any) => any);
export type ICreatePkgCachePathFn = Record<string, ICreatePkgCachePathFunction>;
export type ICreatePkgCachePathMap = Record<string, string | [string, ...string[]]>;
export type ICreatePkgCachePath<T extends ICreatePkgCachePathMap, T2 extends Record<string, ICreatePkgCachePathFunction<ICreatePkgCachePath<T, T2>>>> = ICreatePkgPath & {
    cacheFilePaths: {
        recentUpdate: string;
        recentUpdateDay: string;
        task001: string;
        infoPack: string;
        idAuthors: string;
        idTitles: string;
        idUpdate: string;
        idChapters: string;
        idVolumes: string;
        ids: string;
        titles: string;
        authors: string;
        tags: string;
        cookiesCacheFile: string;
        axiosCacheFile: string;
        passwordLocalFile: string;
        dirDataRoot: string;
        dirTempRoot: string;
    } & Record<keyof T, string>;
    fn: {
        cacheFileInfoPath(id: string | number): string;
    } & {
        [P in keyof T2]: (...argv: Parameters<T2[P]>) => ReturnType<T2[P]>;
    };
};
export declare function createPkgCachePath<T extends Record<string, string | [string, ...string[]]>, T2 extends Record<string, ICreatePkgCachePathFunction<ICreatePkgCachePath<T, ICreatePkgCachePathFn>>>>(root: string, options?: {
    map?: T;
    fn?: T2;
}): ICreatePkgCachePath<T, T2>;
export declare function wrapProxy<T extends Record<string | number | symbol, any>>(target: T): T;
