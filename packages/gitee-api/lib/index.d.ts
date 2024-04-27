import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import { ITSPickExtra, ITSValueOrArray } from 'ts-type';
import { IBluebird } from 'restful-decorator/lib/index';
import LazyURL from 'lazy-url';
import { IBranchInfo, IBranchInfoSimple, IComment, ICompareCommits, IIssuesState, IOauthTokenData, IOptionsPages, IRepoContentsFile, IRepoContentsFileBlobs, IRepoContentsFileCreated, IRepoInfo2, IRepoLanguage, IUserInfo, IRepoList, IRepoListOptions, IRepoListOptions2, IRepoListOptions3 } from './types';
import Bluebird from 'bluebird';
declare const SymApiOptions: unique symbol;
export interface IGiteeOptions extends ITSPickExtra<IGiteeOptionsCore, 'clientId' | 'clientSecret'> {
    defaults?: AxiosRequestConfig;
}
export interface IGiteeOptionsCore {
    clientId: string;
    clientSecret: string;
    scope?: string | 'user_info issues notes';
    state?: string | 'all';
    owner?: string;
    repo?: string;
    redirect_uri?: string;
}
export declare const GITEE_SCOPES: readonly string[];
export declare class GiteeV5Client extends AbstractHttpClient {
    protected [SymApiOptions]: IGiteeOptionsCore;
    static allScope(): string[];
    constructor(options: IGiteeOptions);
    protected _init(defaults?: AxiosRequestConfig, options?: IGiteeOptions): AxiosRequestConfig;
    setAccessToken(accessToken: string): this;
    requestAccessToken(code: string, redirect_uri?: string | URL, redirect_uri2?: string | URL): IBluebird<IOauthTokenData>;
    refreshAccessToken(refresh_token: string): IBluebird<IOauthTokenData>;
    oauthTokenByPassword(loginData: {
        username: string;
        password: string;
        scope?: string;
    }): IBluebird<IOauthTokenData>;
    redirectUrl(redirect_uri?: string | URL, redirect_uri2?: string | URL): LazyURL;
    /**
     * 瀏覽器 only
     */
    redirectAuth(redirect_uri?: string | URL, redirect_uri2?: string | URL, target?: 'self' | '_blank'): Window;
    /**
     * 获取仓库具体路径下的内容
     */
    repoContents(setting: {
        owner: string;
        repo: string;
        targetPath: string;
        ref?: string;
    }, isFile: true): IBluebird<IRepoContentsFile>;
    repoContents(setting: {
        owner: string;
        repo: string;
        targetPath: string;
        ref?: string;
    }, isFile: false): IBluebird<IRepoContentsFile[]>;
    repoContents(setting: {
        owner: string;
        repo: string;
        targetPath: string;
        ref?: string;
    }, isFile?: boolean): IBluebird<ITSValueOrArray<IRepoContentsFile>>;
    /**
     * 获取文件Blob
     */
    repoContentsBlobs(setting: {
        owner: string;
        repo: string;
        /**
         * 文件的 Blob SHA，可通过 [获取仓库具体路径下的内容] API 获取
         */
        sha: string;
    }, autoDecode?: boolean): IBluebird<IRepoContentsFileBlobs & {
        buffer?: Buffer;
    }>;
    repoContentsCreate(setting: {
        owner: string;
        repo: string;
        targetPath: string;
        content: string | Buffer;
        message: string;
        branch?: string;
        'committer[name]'?: string;
        'committer[email]'?: string;
        'author[name]'?: string;
        'author[email]'?: string;
    }): Bluebird<IRepoContentsFileCreated>;
    repoContentsUpdate(setting: {
        owner: string;
        repo: string;
        targetPath: string;
        content: string | Buffer;
        message: string;
        sha: string;
        branch?: string;
        'committer[name]'?: string;
        'committer[email]'?: string;
        'author[name]'?: string;
        'author[email]'?: string;
    }): Bluebird<IRepoContentsFileCreated>;
    userKeys(page?: number, per_page?: number): IBluebird<{
        id: number;
        key: string;
        url: string;
        title: string;
        created_at: string;
    }[]>;
    /**
     * 获取仓库的Commit评论
     */
    repoCommitCommentsAll(setting: {
        owner: string;
        repo: string;
        page?: number;
        per_page?: number;
    }): IBluebird<IComment[]>;
    /**
     * 获取单个Commit的评论
     */
    repoCommitComments(setting: {
        owner: string;
        repo: string;
        ref: string;
        page?: number;
        per_page?: number;
    }): IBluebird<IComment[]>;
    /**
     * 获取仓库的某条Commit评论
     */
    repoCommitCommentByID(setting: {
        owner: string;
        repo: string;
        id: string;
    }): IBluebird<IComment>;
    repoInfo(setting: {
        owner: string;
        repo: string;
    }): IBluebird<IRepoInfo2>;
    /**
     * 查看仓库的Forks
     */
    repoForks(setting: {
        owner: string;
        repo: string;
        /**
         * 排序方式: fork的时间(newest, oldest)，star的人数(stargazers)
         */
        sort?: 'oldest' | 'newest' | 'stargazers';
    } & IOptionsPages): IBluebird<IRepoInfo2>;
    /**
     * Fork一个仓库 (原始 api)
     */
    _forkRepo(setting: {
        owner: string;
        repo: string;
        /**
         * 组织空间地址，不填写默认Fork到用户个人空间地址
         */
        organization?: string;
    }): IBluebird<IRepoInfo2>;
    /**
     * Fork一个仓库 當發生錯誤時 試圖搜尋已存在的 fork
     * 如果需要使用原始 api 請用 `_forkRepo`
     */
    forkRepo(options: {
        owner: string;
        repo: string;
        /**
         * 组织空间地址，不填写默认Fork到用户个人空间地址
         */
        organization?: string;
    }): IBluebird<IRepoInfo2>;
    /**
     * 判断用户是否为仓库成员
     */
    isRepoCollaborators(setting: {
        owner: string;
        repo: string;
        username: string;
    }): IBluebird<boolean>;
    searchIssues(setting: {
        q: string;
        page?: number;
        /**
         * 每页的数量，最大为 100
         */
        per_page?: number;
        repo?: string;
        language?: IRepoLanguage;
        state?: IIssuesState;
        /**
         * 筛选指定创建者 (username/login) 的 issues
         */
        author?: string;
        /**
         * 筛选指定负责人 (username/login) 的 issues
         */
        assignee?: string;
        /**
         * 排序字段，created_at(创建时间)、last_push_at(更新时间)、notes_count(评论数)，默认为最佳匹配
         */
        sort?: 'created_at' | 'last_push_at' | 'notes_count';
        order?: 'desc' | 'asc';
    }): IBluebird<unknown>;
    /**
     * 两个Commits之间对比的版本差异
     */
    compareCommits(setting: {
        owner: string;
        repo: string;
        /**
         * Commit提交的SHA值或者分支名作为对比起点
         */
        base: string;
        /**
         * Commit提交的SHA值或者分支名作为对比终点
         */
        head: string;
    }): IBluebird<ICompareCommits>;
    pullRequestCreate(setting: {
        owner: string;
        repo: string;
        title: string;
        head: string;
        base: string;
        body?: string;
        milestone_number?: number;
        labels?: string;
        issue?: string;
        assignees?: string;
        testers?: string;
    }): IBluebird<ICompareCommits>;
    repoBranchInfo(setting: {
        owner: string;
        repo: string;
        branch?: string;
    }): IBluebird<IBranchInfo>;
    repoBranchList(setting: {
        owner: string;
        repo: string;
    }): IBluebird<IBranchInfoSimple[]>;
    /**
     * 建立一個分支 (允許將 refs 設定為他人的 repo 下的 commit)
     */
    repoBranchCreate(setting: {
        owner: string;
        repo: string;
        refs: string;
        branch_name: string;
    }): IBluebird<IBranchInfo>;
    /**
     * 建立一個來自他人 repo 分支的分支
     */
    repoBranchCreateByOtherRepo(setting: {
        owner: string;
        repo: string;
        branch_name: string;
    }, fromTarget: {
        owner: string;
        repo: string;
        branch?: string;
    }): Bluebird<IBranchInfo>;
    userInfo(): IBluebird<IUserInfo>;
    /**
     * 获取某个用户的公开仓库
     */
    usersUsernameRepos(options: IRepoListOptions): IBluebird<IRepoList>;
    /**
     * 获取一个组织的仓库
     */
    orgsRepos(options: IRepoListOptions3): IBluebird<IRepoList>;
    /**
     * 列出授权用户的所有仓库
     */
    myRepoList(options?: IRepoListOptions2): IBluebird<IRepoList>;
    userForks(options: IRepoListOptions): Bluebird<IRepoList>;
    orgsForks(options: IRepoListOptions3): Bluebird<IRepoList>;
    myForks(options: IRepoListOptions2): Bluebird<IRepoList>;
    protected _hasFork<O1 extends IRepoListOptions | IRepoListOptions2 | IRepoListOptions3, O2 extends {
        owner: string;
        repo: string;
    }>(fn: (userOptions: O1, targetRepoOptions: O2) => IBluebird<IRepoList>, userOptions: O1, targetRepoOptions: O2, cache?: {
        last2?: IRepoInfo2[];
        last?: IRepoInfo2[];
    }): IBluebird<IRepoInfo2>;
    userHasFork(userOptions: IRepoListOptions, targetRepoOptions: {
        owner: string;
        repo: string;
    }): IBluebird<IRepoInfo2>;
    orgHasFork(orgOptions: IRepoListOptions3, targetRepoOptions: {
        owner: string;
        repo: string;
    }): IBluebird<IRepoInfo2>;
    myHasFork(userOptions: IRepoListOptions2, targetRepoOptions: {
        owner: string;
        repo: string;
    }): IBluebird<IRepoInfo2>;
}
export default GiteeV5Client;
