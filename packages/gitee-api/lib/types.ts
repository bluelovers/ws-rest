/**
 * Created by user on 2019/6/10.
 */

export type IGrantType = 'authorization_code' | 'password' | 'client_credentials' | 'refresh_token';

export interface IRepoContentsFile
{
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

export interface IRepoContentsFileUpdate extends IRepoContentsFile
{
	encoding: string;
	content: string;
}

export interface IRepoContentsFileBlobs
{
	sha: string;
	size: number;
	url: string;
	content: string;
	encoding: string | 'base64' | BufferEncoding;
}

export interface ICommitUser
{
	name: string;
	date: string;
	email: string;
}

export interface ICommitTreeSimpleData
{
	sha: string;
	url: string;
}

export interface IRepoContentsFileCreated
{
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

export interface IComment
{
	body: string
	body_html: string
	created_at: string
	id: string
	source: string
	target: string
	user: string
}

export type IUserType = string | 'User';

export interface IOwner
{
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

export type IRepoLanguage = string | 'JavaScript';

export interface IRepoNamespace
{
	id: number;
	type: string | 'personal';
	name: string;
	path: string;
	html_url: string;
}

export interface IRepoInfo
{
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
	default_branch: string | 'master';
	open_issues_count: number;
	has_issues: boolean;
	has_wiki: boolean;
	pull_requests_enabled: boolean;
	has_page: boolean;
	license: any;
	outsourced: boolean;
	project_creator: string;
	members: string[];
	pushed_at: string;
	created_at: string;
	updated_at: string;
	parent?: IRepoParent;
	paas: any;
	stared: boolean;
	watched: boolean;
	permission: {
		pull: boolean;
		push: boolean;
		admin: boolean;
	};
	relation: string | 'master';
}

export interface IRepoParent
{
	id: number;
	full_name: string;
	human_name: string;
	url: string;
	namespace: {};
	path: string;
	name: string;
	owner: {};
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
	homepage: any;
	language: string;
	forks_count: number;
	stargazers_count: number;
	watchers_count: number;
	default_branch: string;
	open_issues_count: number;
	has_issues: boolean;
	has_wiki: boolean;
	pull_requests_enabled: boolean;
	has_page: boolean;
	license: any;
	outsourced: boolean;
	project_creator: string;
	members: string[];
	pushed_at: string;
	created_at: string;
	updated_at: string;
	parent: any;
	paas: any;
}

export type IIssuesState = 'open' | 'closed' | 'rejected';

export interface ICommitUserInfo
{
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

export interface ICompareCommits
{
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

export interface IBranchInfoSimple
{
	name: string;
	commit: {
		sha: string;
		url: string;
	};
	protected: boolean;
	protection_url: string;
}

interface IAuthUser
{
	avatar_url: string;
	url: string;
	id: number;
	login: string;
}

export interface IBranchInfo extends IBranchInfoSimple
{
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
