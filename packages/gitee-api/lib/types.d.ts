/**
 * Created by user on 2019/6/10.
 */
/// <reference types="node" />
export type IGrantType = 'authorization_code' | 'password' | 'client_credentials' | 'refresh_token';
import { ITSValueOrArray } from 'ts-type';
export type IRepoLanguage = string | 'JavaScript' | 'TypeScript';
export type IUserType = string | 'User';
export type IIssuesState = 'open' | 'closed' | 'rejected';
export type IBranchName<T extends string = string> = string | 'master' | 'dev' | T;
export type ILicenseName = string | 'MIT';
export type IDirection = 'asc' | 'desc';
export interface IError001 {
    error: string | 'invalid_grant' | 'invalid_client';
    error_description: string;
}
export interface IError002<T extends string = string> {
    message: T;
}
export interface IOauthTokenData {
    access_token: string;
    token_type: string | 'bearer';
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
}
export interface IRepoContentsFile {
    type: string;
    size: number;
    name: string;
    path: string;
    sha: string;
    url: string;
    html_url: string;
    download_url: string;
    _links: {
        self: string;
        html: string;
    };
}
export interface IRepoContentsFileUpdate extends IRepoContentsFile {
    encoding: string;
    content: string;
}
export interface IRepoContentsFileBlobs {
    sha: string;
    size: number;
    url: string;
    content: string;
    encoding: string | 'base64' | BufferEncoding;
}
export interface ICommitUser {
    name: string;
    date: string;
    email: string;
}
export interface ICommitTreeSimpleData {
    sha: string;
    url: string;
}
export interface IRepoContentsFileCreated {
    content: IRepoContentsFile;
    commit: {
        sha: string;
        author: ICommitUser;
        committer: ICommitUser;
        message: string;
        tree: ICommitTreeSimpleData;
        parents: ICommitTreeSimpleData[];
    };
}
export interface IComment {
    body: string;
    body_html: string;
    created_at: string;
    id: string;
    source: string;
    target: string;
    user: string;
}
export interface IOwner {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: IUserType;
    site_admin: boolean;
}
export interface IRepoNamespace {
    id: number;
    type: string | 'personal';
    name: string;
    path: string;
    html_url: string;
}
export interface IRepoInfo1 {
    id: number;
    full_name: string;
    human_name: string;
    url: string;
    namespace: IRepoNamespace;
    path: string;
    name: string;
    owner: IOwner;
    description: string;
    private: boolean;
    public: boolean;
    internal: boolean;
    fork: boolean;
    html_url: string;
    ssh_url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    hooks_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    stargazers_url: string;
    contributors_url: string;
    commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    recommend: boolean;
    homepage: string;
    language: IRepoLanguage;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    default_branch: IBranchName;
    open_issues_count: number;
    has_issues: boolean;
    has_wiki: boolean;
    pull_requests_enabled: boolean;
    has_page: boolean;
    license: ILicenseName;
    outsourced: boolean;
    project_creator: string;
    members: string[];
    pushed_at: string;
    created_at: string;
    updated_at: string;
    parent: IRepoInfo1;
    paas: any;
}
export interface IRepoInfo2 extends IRepoInfo1 {
    parent: IRepoInfo2;
    stared: boolean;
    watched: boolean;
    permission: {
        pull: boolean;
        push: boolean;
        admin: boolean;
    };
    relation: IBranchName;
}
export interface ICommitUserInfo {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
export interface ICompareCommits {
    base_commit: {
        url: string;
        sha: string;
        html_url: string;
        comments_url: string;
        commit: {
            author: ICommitUser;
            commiter: ICommitUser;
            message: string;
            tree: ICommitTreeSimpleData;
        };
        author: ICommitUserInfo;
        committer: ICommitUserInfo;
        parents: ICommitTreeSimpleData[];
        stats: {
            id: string;
            additions: number;
            deletions: number;
            total: number;
        };
    };
    merge_base_commit: {
        url: string;
        sha: string;
        html_url: string;
        comments_url: string;
        commit: {
            author: ICommitUser;
            commiter: ICommitUser;
            message: string;
            tree: ICommitTreeSimpleData;
        };
        author: ICommitUserInfo;
        committer: ICommitUserInfo;
        parents: ICommitTreeSimpleData[];
        stats: {
            id: string;
            additions: number;
            deletions: number;
            total: number;
        };
    };
    commits: any[];
    files: any[];
}
export interface IBranchInfoSimple {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
    protection_url: string;
}
interface IAuthUser {
    avatar_url: string;
    url: string;
    id: number;
    login: string;
}
export interface IBranchInfo extends IBranchInfoSimple {
    commit: IBranchInfoSimple["commit"] & {
        commit: {
            author: ICommitUser;
            url: string;
            message: string;
            tree: ICommitTreeSimpleData;
            committer: ICommitUser;
        };
        author: IAuthUser;
        parents: ICommitTreeSimpleData[];
        committer: IAuthUser;
    };
    _links: {
        html: string;
        self: string;
    };
}
export interface IUserInfo extends ICommitUserInfo {
    "blog": string;
    "weibo": string;
    "bio": string;
    "public_repos": number;
    "public_gists": number;
    "followers": number;
    "following": number;
    "stared": number;
    "watched": number;
    "created_at": string;
    "updated_at": string;
}
export type IRepoList = IRepoInfo2[];
export interface IOptionsPages {
    page?: number;
    per_page?: number;
}
export interface IOptionsDirection {
    direction?: IDirection;
}
/**
 * 获取某个用户的公开仓库
 */
export interface IRepoListOptions extends IOptionsPages, IOptionsDirection {
    username: string;
    /**
     * 筛选用户仓库: 其创建(owner)、个人(personal)、其为成员(member)、公开(public)、私有(private)，不能与 visibility 或 affiliation 参数一并使用，否则会报 422 错误
     */
    type?: 'owner' | 'personal' | 'member' | 'public';
    /**
     * 排序方式: 创建时间(created)，更新时间(updated)，最后推送时间(pushed)，仓库所属与名称(full_name)。默认: full_name
     */
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
}
/**
 * 列出授权用户的所有仓库
 */
export interface IRepoListOptions2 extends Omit<IRepoListOptions, 'type' | 'username'> {
    /**
     * 公开(public)、私有(private)或者所有(all)，默认: 所有(all)
     */
    visibility?: 'public' | 'private' | 'all';
    /**
     * owner(授权用户拥有的仓库)、collaborator(授权用户为仓库成员)、organization_member(授权用户为仓库所在组织并有访问仓库权限)、enterprise_member(授权用户所在企业并有访问仓库权限)、admin(所有有权限的，包括所管理的组织中所有仓库、所管理的企业的所有仓库)。 可以用逗号分隔符组合。如: owner, organization_member 或 owner, collaborator, organization_member
     */
    affiliation?: ITSValueOrArray<'owner' | 'collaborator' | 'organization_member' | 'enterprise_member' | 'admin'>;
    /**
     * 筛选用户仓库: 其创建(owner)、个人(personal)、其为成员(member)、公开(public)、私有(private)，不能与 visibility 或 affiliation 参数一并使用，否则会报 422 错误
     */
    type?: IRepoListOptions["type"] | 'private';
}
/**
 * 获取一个组织的仓库
 */
export interface IRepoListOptions3 extends IOptionsPages {
    /**
     * 组织的路径(path/login)
     */
    org: string;
    /**
     * 筛选仓库的类型，可以是 all, public, private。默认: all
     */
    type?: 'all' | 'public' | 'private';
}
export {};
