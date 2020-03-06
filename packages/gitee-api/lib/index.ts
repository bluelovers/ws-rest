import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import {
	BaseUrl,
	BodyData,
	CacheRequest,
	CatchError,
	FormUrlencoded,
	GET,
	HandleParamMetadata,
	Headers,
	methodBuilder,
	ParamData,
	ParamMapAuto,
	ParamMapQuery,
	POST,
	PUT,
	RequestConfigs,
	TransformRequest,
} from 'restful-decorator/lib/decorators';
import { ITSPickExtra, ITSValueOrArray } from 'ts-type';
import { IBluebird } from 'restful-decorator/lib/index';
import LazyURL from 'lazy-url';
import { defaultsDeep } from 'lodash';
import {
	IBranchInfo,
	IBranchInfoSimple,
	IComment,
	ICompareCommits,
	IError001, IError002,
	IIssuesState,
	IOauthTokenData, IOptionsPages,
	IRepoContentsFile,
	IRepoContentsFileBlobs,
	IRepoContentsFileCreated,
	IRepoInfo2,
	IRepoLanguage,
	IUserInfo,
	IRepoList,
	IRepoListOptions, IRepoListOptions2, IRepoListOptions3,
} from './types';
import { _makeAuthorizationValue, EnumAuthorizationType } from 'restful-decorator/lib/decorators/headers';
// @ts-ignore
import { AxiosError } from 'axios';
import { mergeAxiosErrorWithResponseData } from 'restful-decorator/lib/wrap/error';
import Bluebird from 'bluebird';
import { toBase64, isForkFrom, valueToArray } from './util';
import { CatchResponseDataError } from './decorators';
// @ts-ignore
import deepEql from 'deep-eql';

const SymApiOptions = Symbol('options');

export interface IGiteeOptions extends ITSPickExtra<IGiteeOptionsCore, 'clientId' | 'clientSecret'>
{
	defaults?: AxiosRequestConfig,
}

export interface IGiteeOptionsCore
{
	clientId: string,
	clientSecret: string,
	scope?: string | 'user_info issues notes',
	state?: string | 'all',

	owner?: string,
	repo?: string,

	redirect_uri?: string,

}

export const GITEE_SCOPES = Object.freeze('user_info projects pull_requests issues notes keys hook groups gists enterprises'.split(' '));

@BaseUrl('https://gitee.com/api/v5/')
@Headers({
	'Accept': 'application/json',
})
@RequestConfigs({
	responseType: 'json',
})
@CacheRequest({
	cache: {
		maxAge: 15 * 60 * 1000,
	},
})
/**
 * @see https://gitee.com/api/v5/oauth_doc
 * @link https://gitee.com/api/v5/swagger
 *
 * @todo 好一點的方法命名
 */
export class GiteeV5Client extends AbstractHttpClient
{
	protected [SymApiOptions]: IGiteeOptionsCore;

	static allScope()
	{
		return GITEE_SCOPES.slice()
	}

	constructor(options: IGiteeOptions)
	{
		super(options.defaults, options);
	}

	protected _init(defaults?: AxiosRequestConfig, options?: IGiteeOptions)
	{
		//let { scope = 'user_info issues notes', clientId, clientSecret, state = 'all' } = options || {};
		let { scope, clientId, clientSecret, state, redirect_uri } = options || {};

		defaults = super._init(defaults);

		this[SymApiOptions] = Object.assign(this[SymApiOptions] || {} as any, options, {
			scope,
			clientId,
			clientSecret,
			state,
			redirect_uri,
		});

		return defaults;
	}

	setAccessToken(accessToken: string)
	{
		this.$http.defaults.headers.Authorization = _makeAuthorizationValue(accessToken, EnumAuthorizationType.Token);

		return this;
	}

	@POST('/oauth/token')
	@FormUrlencoded
	@BodyData({
		grant_type: 'authorization_code',
	})
	requestAccessToken(code: string,
		redirect_uri?: string | URL,
		redirect_uri2?: string | URL,
	): IBluebird<IOauthTokenData>
	{
		let url = new LazyURL('/oauth/token', this.$baseURL);

		let { state, scope, clientSecret, clientId } = this[SymApiOptions];

		let data = new URLSearchParams();

		data.set('client_id', clientId);
		data.set('client_secret', clientSecret);
		data.set('code', code);
		data.set('grant_type', 'authorization_code');
		data.set('redirect_uri', this.redirectUrl(redirect_uri, redirect_uri2).toRealString());

		return Bluebird.resolve(this.$http({
				url: url.toRealString(),
				method: 'POST',
				data,
			}))
			.then<IOauthTokenData>(r => r.data)
			.catch(e =>
			{

				if (e.response.data.error)
				{
					return Bluebird.reject(e.response.data as IError001)
				}

				return Bluebird.reject(e);
			})
	}

	@POST('/oauth/token')
	@FormUrlencoded
	@BodyData({
		grant_type: 'refresh_token',
	})
	@methodBuilder({
		returnData: true,
	})
	refreshAccessToken(@ParamData('refresh_token') refresh_token: string): IBluebird<IOauthTokenData>
	{
		return null
	}

	@POST('/oauth/token')
	@FormUrlencoded
	@BodyData({
		grant_type: 'password',
	})
	@methodBuilder(function (info)
	{
		// @ts-ignore
		let { state, scope, clientSecret, clientId } = info.thisArgv[SymApiOptions];

		info.requestConfig.data.client_id = clientId;
		info.requestConfig.data.client_secret = clientSecret;

		if (!info.requestConfig.data.scope && scope)
		{
			info.requestConfig.data.scope = scope
		}

		return info;
	}, {
		returnData: true,
	})
	oauthTokenByPassword(@ParamMapAuto() loginData: {
		username: string,
		password: string,

		scope?: string,
	}): IBluebird<IOauthTokenData>
	{
		return null
	}

	redirectUrl(redirect_uri?: string | URL, redirect_uri2?: string | URL)
	{
		let url = new LazyURL('/oauth/authorize', this.$baseURL);

		if (redirect_uri == null)
		{
			if (!_hasWindow() && (typeof this[SymApiOptions].redirect_uri === 'string'))
			{
				redirect_uri = this[SymApiOptions].redirect_uri
			}
			else
			{
				// @ts-ignore
				redirect_uri = window.location.href
			}
		}
		else if (typeof redirect_uri != 'string')
		{
			redirect_uri = redirect_uri.toString();
		}

		if (redirect_uri2)
		{
			redirect_uri = new LazyURL(redirect_uri);

			redirect_uri.searchParams.set('_redirect_uri_', redirect_uri2.toString());

			redirect_uri = redirect_uri.toString();
		}

		let { state, scope, clientSecret, clientId } = this[SymApiOptions];

		url.searchParams.set('client_id', clientId);
		url.searchParams.set('redirect_uri', redirect_uri);
		scope && url.searchParams.set('scope', scope);
		state && url.searchParams.set('state', state);
		url.searchParams.set('response_type', 'code');

		return url;
	}

	/**
	 * 瀏覽器 only
	 */
	redirectAuth(redirect_uri?: string | URL, redirect_uri2?: string | URL, target: 'self' | '_blank' = 'self'): Window
	{
		// @ts-ignore
		return window.open(this.redirectUrl(redirect_uri).toString(), redirect_uri2, target || 'self')
	}

	/**
	 * 获取仓库具体路径下的内容
	 */
	repoContents(setting: {
		owner: string,
		repo: string,
		targetPath: string,
		ref?: string,
	}, isFile: true): IBluebird<IRepoContentsFile>
	repoContents(setting: {
		owner: string,
		repo: string,
		targetPath: string,
		ref?: string,
	}, isFile: false): IBluebird<IRepoContentsFile[]>
	repoContents(setting: {
		owner: string,
		repo: string,
		targetPath: string,
		ref?: string,
	}, isFile?: boolean): IBluebird<ITSValueOrArray<IRepoContentsFile>>
	@GET('/api/v5/repos/{owner}/{repo}/contents{/targetPath}')
	@methodBuilder({
		returnData: true,
	})
	repoContents(@ParamMapAuto() setting: {
		owner: string,
		repo: string,
		targetPath: string,
		ref?: string,
	}, isFile?: boolean): IBluebird<ITSValueOrArray<IRepoContentsFile>>
	{
		return
	}

	@GET('repos/{owner}/{repo}/git/blobs/{sha}')
	@methodBuilder({
		returnData: true,
	})
	/**
	 * 获取文件Blob
	 */
	repoContentsBlobs(@ParamMapAuto() setting: {
		owner: string,
		repo: string,
		/**
		 * 文件的 Blob SHA，可通过 [获取仓库具体路径下的内容] API 获取
		 */
		sha: string,
	}, autoDecode?: boolean): IBluebird<IRepoContentsFileBlobs & {
		buffer?: Buffer,
	}>
	{

		if (autoDecode)
		{
			let data = (this.$returnValue as any as IRepoContentsFileBlobs);

			data.content = data.content.replace(/\n$/, '')

			let buffer = Buffer.from(data.content, data.encoding as BufferEncoding) as Buffer;

			return Bluebird.resolve({
				...data,
				buffer: buffer,
			});
		}

		return
	}

	@POST('repos/{owner}/{repo}/contents{targetPath}')
	@FormUrlencoded
	@TransformRequest(function base64(data)
	{
		if (data.content)
		{
			data.content = toBase64(data.content);
		}

		return data;
	})
	@methodBuilder()
	@CatchResponseDataError()
	repoContentsCreate(@ParamMapAuto() setting: {
		owner: string,
		repo: string,
		targetPath: string,
		content: string | Buffer,
		message: string,
		branch?: string,
		'committer[name]'?: string,
		'committer[email]'?: string,
		'author[name]'?: string,
		'author[email]'?: string,
	}): Bluebird<IRepoContentsFileCreated>
	{
		return;
	}

	@PUT('repos/{owner}/{repo}/contents/{targetPath}')
	@FormUrlencoded
	@TransformRequest(function base64(data)
	{
		if (data.content)
		{
			data.content = toBase64(data.content);
		}

		return data;
	})
	@methodBuilder({
		returnData: true,
	})
	@CatchError(function (e: AxiosError<{
		message: string
	}>)
	{
		return Bluebird.reject(mergeAxiosErrorWithResponseData(e))
	})
	repoContentsUpdate(@ParamMapAuto() setting: {
		owner: string,
		repo: string,
		targetPath: string,
		content: string | Buffer,
		message: string,
		sha: string,

		branch?: string,

		'committer[name]'?: string,
		'committer[email]'?: string,
		'author[name]'?: string,
		'author[email]'?: string,

	}): Bluebird<IRepoContentsFileCreated>
	{
		return;
	}

	@GET('user/keys')
	@methodBuilder({
		returnData: true,
	})
	userKeys(
		@ParamData('page') page?: number,
		@ParamData('per_page') per_page?: number,
	): IBluebird<{
		id: number;
		key: string;
		url: string;
		title: string;
		created_at: string;
	}[]>
	{
		//console.dir(777);

		//return this.$returnValue.data as any
		return
	}

	@GET('repos/{owner}/{repo}/comments')
	@methodBuilder()
	/**
	 * 获取仓库的Commit评论
	 */
	repoCommitCommentsAll(@ParamMapAuto() setting: {
		owner: string,
		repo: string,

		page?: number,
		per_page?: number,

	}): IBluebird<IComment[]>
	{
		return
	}

	@GET('repos/{owner}/{repo}/commits/{ref}/comments')
	@methodBuilder()
	/**
	 * 获取单个Commit的评论
	 */
	repoCommitComments(@ParamMapAuto() setting: {
		owner: string,
		repo: string,

		ref: string,

		page?: number,
		per_page?: number,

	}): IBluebird<IComment[]>
	{
		return
	}

	@GET('repos/{owner}/{repo}/comments/{id}')
	@methodBuilder()
	/**
	 * 获取仓库的某条Commit评论
	 */
	repoCommitCommentByID(@ParamMapAuto() setting: {
		owner: string,
		repo: string,

		id: string,

	}): IBluebird<IComment>
	{
		return
	}

	@GET('repos/{owner}/{repo}')
	@methodBuilder()
	repoInfo(@ParamMapAuto() setting: {
		owner: string,
		repo: string,
	}): IBluebird<IRepoInfo2>
	{
		return
	}

	@GET('repos/{owner}/{repo}/forks')
	@methodBuilder()
	/**
	 * 查看仓库的Forks
	 */
	repoForks(@ParamMapAuto() setting: {
		owner: string,
		repo: string,

		/**
		 * 排序方式: fork的时间(newest, oldest)，star的人数(stargazers)
		 */
		sort?: 'oldest' | 'newest' | 'stargazers',

	} & IOptionsPages): IBluebird<IRepoInfo2>
	{
		return
	}

	@POST('repos/{owner}/{repo}/forks')
	@methodBuilder()
	/**
	 * Fork一个仓库 (原始 api)
	 */
	_forkRepo(@ParamMapAuto() setting: {
		owner: string,
		repo: string,

		/**
		 * 组织空间地址，不填写默认Fork到用户个人空间地址
		 */
		organization?: string,
	}): IBluebird<IRepoInfo2>
	{
		return
	}

	/**
	 * Fork一个仓库 當發生錯誤時 試圖搜尋已存在的 fork
	 * 如果需要使用原始 api 請用 `_forkRepo`
	 */
	forkRepo(options: {
		owner: string,
		repo: string,

		/**
		 * 组织空间地址，不填写默认Fork到用户个人空间地址
		 */
		organization?: string,
	}): IBluebird<IRepoInfo2>
	{
		return this._forkRepo(options)
			.catch(async (e: AxiosError) => {

				try
				{
					let code = e.response.status;
					let data = e.response.data as IError002<'已经存在同名的仓库, Fork 失败' | '已经Fork，不允许重复Fork'>;

					if (code == 403 || data.message === '已经存在同名的仓库, Fork 失败')
					{
						let owner: string;

						if (options.organization)
						{
							owner = options.organization
						}
						else
						{
							let useInfo = await this.userInfo();
							owner = useInfo.login;
						}

						let repoInfo = await this.repoInfo({
							owner,
							repo: options.repo,
						});

						if (isForkFrom(repoInfo, options))
						{
							return repoInfo;
						}
					}
					else if (code == 400 || data.message === '已经Fork，不允许重复Fork')
					{
						let repoInfo: IRepoInfo2;

						if (options.organization)
						{
							repoInfo = await this.orgHasFork({
								org: options.organization,
							}, {
								repo: options.repo,
								owner: options.owner,
							});
						}
						else
						{
							repoInfo = await this.myHasFork({}, {
								repo: options.repo,
								owner: options.owner,
							});
						}

						if (repoInfo)
						{
							return repoInfo;
						}
					}
				}
				catch (e2)
				{

				}

				return Bluebird.reject(e)
			})
		;
	}

	@GET('repos/{owner}/{repo}/collaborators/{username}')
	@methodBuilder()
	@CatchError(function (e: AxiosError)
	{
		if (e.response.data.message === "404 Not Found")
		{
			return false
		}

		return Bluebird.reject(e)
	})
	/**
	 * 判断用户是否为仓库成员
	 */
	isRepoCollaborators(@ParamMapAuto() setting: {
		owner: string,
		repo: string,
		username: string,
	}): IBluebird<boolean>
	{
		if ((this.$returnValue as any) === '')
		{
			return true as any;
		}

		return
	}

	@GET('search/issues')
	@methodBuilder()
	searchIssues(@ParamMapAuto() setting: {
		q: string,
		page?: number,
		/**
		 * 每页的数量，最大为 100
		 */
		per_page?: number,
		repo?: string,
		language?: IRepoLanguage,
		state?: IIssuesState,

		/**
		 * 筛选指定创建者 (username/login) 的 issues
		 */
		author?: string,
		/**
		 * 筛选指定负责人 (username/login) 的 issues
		 */
		assignee?: string,

		/**
		 * 排序字段，created_at(创建时间)、last_push_at(更新时间)、notes_count(评论数)，默认为最佳匹配
		 */
		sort?: 'created_at' | 'last_push_at' | 'notes_count',

		order?: 'desc' | 'asc',

	}): IBluebird<unknown>
	{
		return
	}

	@GET('repos/{owner}/{repo}/compare/{base}...{head}')
	@methodBuilder()
	/**
	 * 两个Commits之间对比的版本差异
	 */
	compareCommits(@ParamMapAuto() setting: {
		owner: string,
		repo: string,
		/**
		 * Commit提交的SHA值或者分支名作为对比起点
		 */
		base: string,
		/**
		 * Commit提交的SHA值或者分支名作为对比终点
		 */
		head: string,
	}): IBluebird<ICompareCommits>
	{
		return
	}

	@POST('repos/{owner}/{repo}/pulls')
	@methodBuilder()
	@CatchError(function (e: AxiosError)
	{
		if (e.response.data.message === "Target branch源分支与目标分支一致，无法发起PR。")
		{
			return Bluebird.reject(e.response.data)
		}

		return Bluebird.reject(e)
	})
	pullRequestCreate(@ParamMapAuto() setting: {
		owner: string,
		repo: string,

		title: string,
		head: string,
		base: string,

		body?: string,
		milestone_number?: number,
		labels?: string,
		issue?: string,
		assignees?: string,
		testers?: string,

	}): IBluebird<ICompareCommits>
	{
		return
	}

	@GET('repos/{owner}/{repo}/branches/{branch}')
	// @ts-ignore
	@HandleParamMetadata((info) =>
	{

		let [setting] = info.argv;

		if (!setting.branch)
		{
			throw new TypeError(`branch should not to empty ${JSON.stringify(setting.branch)}`)
		}

		return info;
	})
	@methodBuilder({
		autoRequest: false,
	})
	repoBranchInfo(@ParamMapAuto({
		branch: 'master',
	}) setting: {

		owner: string,
		repo: string,

		branch?: string,

	}): IBluebird<IBranchInfo>
	{
		return this.repoBranchList(setting) as any as IBluebird<IBranchInfo>;
	}

	@GET('repos/{owner}/{repo}/branches{/branch}')
	@methodBuilder()
	repoBranchList(@ParamMapAuto() setting: {

		owner: string,
		repo: string,

	}): IBluebird<IBranchInfoSimple[]>
	{
		return
	}

	@POST('repos/{owner}/{repo}/branches')
	@methodBuilder()
	@CatchResponseDataError()
	/**
	 * 建立一個分支 (允許將 refs 設定為他人的 repo 下的 commit)
	 */
	repoBranchCreate(@ParamMapAuto() setting: {

		owner: string,
		repo: string,

		refs: string,

		branch_name: string,

	}): IBluebird<IBranchInfo>
	{
		return
	}

	@POST('repos/{owner}/{repo}/branches')
	@methodBuilder({
		autoRequest: false,
	})
	/**
	 * 建立一個來自他人 repo 分支的分支
	 */
	repoBranchCreateByOtherRepo(@ParamMapAuto() setting: {

		owner: string,
		repo: string,

		branch_name: string,

	}, fromTarget: {
		owner: string,
		repo: string,
		branch?: string,
	})
	{
		return this
			.repoBranchInfo(fromTarget)
			.then(ret =>
			{
				return this.repoBranchCreate({
					...setting,
					refs: ret.commit.sha,
				})
			})
			;
	}

	@GET('user')
	@methodBuilder()
	userInfo(): IBluebird<IUserInfo>
	{
		return null;
	}

	@GET('users/{username}/repos')
	@methodBuilder()
	/**
	 * 获取某个用户的公开仓库
	 */
	usersUsernameRepos(@ParamMapAuto() options: IRepoListOptions): IBluebird<IRepoList>
	{
		return null;
	}

	@GET('users/{username}/repos')
	@methodBuilder()
	/**
	 * 获取一个组织的仓库
	 */
	orgsRepos(@ParamMapAuto() options: IRepoListOptions3): IBluebird<IRepoList>
	{
		return null;
	}

	@GET('user/repos')
	@methodBuilder()
	@HandleParamMetadata((info) =>
	{

		let [setting] = info.argv;

		if (setting && setting.affiliation)
		{
			if (Array.isArray(setting.affiliation))
			{
				setting.affiliation = setting.affiliation(',');
			}
		}

		return info;
	})
	/**
	 * 列出授权用户的所有仓库
	 */
	myRepoList(@ParamMapQuery() options?: IRepoListOptions2): IBluebird<IRepoList>
	{
		return null;
	}

	userForks(options: IRepoListOptions)
	{
		if (options.type == null)
		{
			options.type = 'owner';
		}

		return this.usersUsernameRepos(options)
			.then(ls => {
				if (ls)
				{
					return valueToArray<IRepoInfo2>(ls).filter(repo => repo.fork)
				}
				return ls;
			})
	}

	orgsForks(options: IRepoListOptions3)
	{
		return this.orgsRepos(options)
			.then(ls => {
				if (ls)
				{
					return valueToArray<IRepoInfo2>(ls).filter(repo => repo.fork)
				}
				return ls;
			})
	}

	myForks(options: IRepoListOptions2)
	{
		if (options.type == null)
		{
			options.type = 'owner';
		}

		return this.myRepoList(options)
			.then(ls => {
				if (ls)
				{
					return valueToArray<IRepoInfo2>(ls).filter(repo => repo.fork)
				}
				return ls;
			})
		;
	}

	protected _hasFork<O1 extends IRepoListOptions | IRepoListOptions2 | IRepoListOptions3, O2 extends {
		owner: string,
		repo: string,
	}>(fn: (userOptions: O1, targetRepoOptions: O2) => IBluebird<IRepoList>, userOptions: O1, targetRepoOptions: O2, cache?: {
		last2?: IRepoInfo2[],
		last?: IRepoInfo2[],
	}): IBluebird<IRepoInfo2>
	{
		if (userOptions.type == null)
		{
			userOptions.type = 'owner';
		}

		// @ts-ignore
		if (userOptions.sort == null)
		{
			// @ts-ignore
			userOptions.sort = 'updated';
		}

		cache = defaultsDeep(cache || {}, {});

		return fn(userOptions, targetRepoOptions)
			.then(ls => {

				if (ls && ls.length && !deepEql(ls, cache.last))
				{
					for (let row of ls)
					{
						if (isForkFrom(row, targetRepoOptions))
						{
							return row;
						}
					}

					const { page = 1 } = userOptions;

					//cache.last2 = ls;
					cache.last = ls;

					return this._hasFork(fn, {
						...userOptions,
						page: page + 1,
					}, targetRepoOptions, cache)
				}

				return null
			})
		;
	}

	userHasFork(userOptions: IRepoListOptions, targetRepoOptions: {
		owner: string,
		repo: string,
	})
	{
		return this._hasFork(this.userForks.bind(this), {
			...userOptions
		}, {
			...targetRepoOptions
		})
	}

	orgHasFork(orgOptions: IRepoListOptions3, targetRepoOptions: {
		owner: string,
		repo: string,
	})
	{
		let type = orgOptions.type || 'all';

		return this._hasFork(this.orgsForks.bind(this), {
			...orgOptions,
			type,
		}, {
			...targetRepoOptions
		})
	}

	myHasFork(userOptions: IRepoListOptions2, targetRepoOptions: {
		owner: string,
		repo: string,
	}): IBluebird<IRepoInfo2>
	{
		return this._hasFork(this.myForks.bind(this), {
			...userOptions
		}, {
			...targetRepoOptions
		})
	}

}

function _hasWindow()
{
	try
	{
		// @ts-ignore
		if (window.location)
		{
			return true;
		}
	}
	catch (e)
	{

	}

	return false;
}

export default GiteeV5Client
