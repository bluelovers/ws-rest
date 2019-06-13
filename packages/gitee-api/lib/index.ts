import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig, IBluebirdAxiosResponse } from 'restful-decorator/lib/types/axios';
import {
	CatchError,
	FormUrlencoded,
	BaseUrl, BodyParams,
	CacheRequest,
	GET,
	Headers,
	methodBuilder, ParamData,
	ParamMapAuto, ParamMapData,
	ParamPath,
	ParamQuery,
	POST,
	HandleParamMetadata,
	RequestConfigs, TransformRequest, PUT,
} from 'restful-decorator/lib/decorators';
import { ITSPickExtra, ITSRequireAtLeastOne, ITSResolvable, ITSValueOrArray } from 'ts-type';
import { IBluebird } from 'restful-decorator/lib/index';
import LazyURL from 'lazy-url';
import {
	IBranchInfo, IBranchInfoSimple,
	IComment, ICompareCommits, IIssuesState,
	IRepoContentsFile,
	IRepoContentsFileBlobs,
	IRepoContentsFileCreated,
	IRepoInfo,
	IRepoLanguage,
} from './types';
import { _makeAuthorizationValue, EnumAuthorizationType } from 'restful-decorator/lib/decorators/headers';
import { mergeClone } from 'restful-decorator/lib/util/merge';
import clone from 'lodash/clone';
// @ts-ignore
import isBase64 from 'is-base64';
import LazyURLSearchParams from 'http-form-urlencoded';
import { AxiosError } from 'axios';
import { mergeAxiosErrorWithResponseData } from 'restful-decorator/lib/wrap/errpr';
import Bluebird from 'bluebird';
import { toBase64 } from './util';

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

}

export const GITEE_SCOPES = Object.freeze('user_info projects pull_requests issues notes keys hook groups gists'.split(' '));

@BaseUrl('https://gitee.com/api/v5/')
@Headers({
	'Accept': 'application/json',
})
@RequestConfigs({
	responseType: 'json',
})
@CacheRequest({
	cache: null && {
		maxAge: 15 * 60 * 1000,
	},
})
/**
 * @see https://gitee.com/api/v5/oauth_doc
 * @todo 好一點的方法命名
 */
export class GiteeV5Client extends AbstractHttpClient
{
	protected [SymApiOptions]: IGiteeOptionsCore;

	constructor(options: IGiteeOptions)
	{
		super(options.defaults, options);
	}

	protected _init(defaults?: AxiosRequestConfig, options?: IGiteeOptions)
	{
		//let { scope = 'user_info issues notes', clientId, clientSecret, state = 'all' } = options || {};
		let { scope, clientId, clientSecret, state } = options || {};

		defaults = super._init(defaults);

		this[SymApiOptions] = Object.assign(this[SymApiOptions] || {} as any, options, {
			scope,
			clientId,
			clientSecret,
			state,
		});

		return defaults;
	}

	setAccessToken(accessToken: string)
	{
		this.$http.defaults.headers.Authorization = _makeAuthorizationValue(accessToken, EnumAuthorizationType.Token);

		return this;
	}

	redirectUrl(redirect_uri?: string | URL, redirect_uri2?: string | URL)
	{
		let url = new LazyURL('/oauth/authorize', this.$baseURL);

		if (redirect_uri == null)
		{
			// @ts-ignore
			redirect_uri = window.location.href
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
	@CatchError(function (e: AxiosError<{
		message: string
	}>)
	{
		return Bluebird.reject(mergeAxiosErrorWithResponseData(e))
	})
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
	}): IBluebird<IRepoInfo>
	{
		return
	}

	@GET('repos/{owner}/{repo}/forks')
	@methodBuilder()
	/**
	 * Fork一个仓库
	 */
	forkRepo(@ParamMapAuto() setting: {
		owner: string,
		repo: string,

		/**
		 * 组织空间地址，不填写默认Fork到用户个人空间地址
		 */
		organization?: string,
	}): IBluebird<IRepoInfo>
	{
		return
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
	@HandleParamMetadata((info) => {

		let [ setting ] = info.argv;

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
			.then(ret => {
				return this.repoBranchCreate({
					...setting,
					refs: ret.commit.sha,
				})
			})
		;
	}

}

export default GiteeV5Client
