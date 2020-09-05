export declare const __path: import("@node-novel/site-cache-util/lib/files").ICreatePkgCachePath<Record<string, string | [string, ...string[]]>, {
    cacheFileInfoPath(this: import("@node-novel/site-cache-util/lib/files").ICreatePkgCachePath<Record<string, string | [string, ...string[]]>, Record<string, import("@node-novel/site-cache-util/lib/files").ICreatePkgCachePathFunction<{
        readonly __root: string;
        join(paths_0: string, ...paths_1: string[]): string;
        resolve(paths_0: string, ...paths_1: string[]): string;
        relative(paths_0: string): string;
    }>>>, id: string | number): string;
}>;
export declare const cacheFilePaths: {
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
} & Record<string, string>, __root: string;
export declare const cacheFileInfoPath: ((id: string | number) => string) & ((id: string | number) => string);
export default cacheFilePaths;
