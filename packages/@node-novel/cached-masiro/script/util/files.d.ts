export declare const __path: import("@node-novel/site-cache-util/lib/files").ICreatePkgCachePath<{
    infoPack: [string, string];
    subforums: [string, string];
    topforums: [string, string];
    dirFid: [string, string];
}, {
    cacheFileInfoPath(this: import("@node-novel/site-cache-util/lib/files").ICreatePkgCachePath<{
        infoPack: [string, string];
        subforums: [string, string];
        topforums: [string, string];
        dirFid: [string, string];
    }, import("@node-novel/site-cache-util/lib/files").ICreatePkgCachePathFn>, id: string | number): string;
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
} & Record<"infoPack" | "subforums" | "topforums" | "dirFid", string>, __root: string;
export declare const cacheFileInfoPath: ((id: string | number) => string) & ((id: string | number) => string);
export default cacheFilePaths;
