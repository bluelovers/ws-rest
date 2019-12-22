import { ParamMapAuto } from 'restful-decorator/lib/decorators/body';
import { ITSPickExtra } from 'ts-type';
import { ITSRequiredPick, ITSPartialPick } from 'ts-type/lib/type/record';

export type IParametersSlice<T extends (...args: any) => any> = T extends (arg1: any, ...args: infer P) => any ? P : never;

export interface IDiscuzForumMini
{
	fid: string;
	forum_name: string;
}

export interface IDiscuzForum extends IDiscuzForumMini
{
	last_thread_time: number;
	last_thread_id: string;
	last_thread_subject: string;

	pages: number,
	page: number,

	/**
	 * 版主
	 */
	moderator: Record<string, string>;

	forum_rules: string,

	subforums: IDiscuzForumMini[],

	thread_types: Record<string, string>,

	/**
	 * 置頂
	 */
	stickthread: IDiscuzForumThread[],

	threads: IDiscuzForumThread[],
}

export interface IDiscuzForumPickThreads extends Omit<IDiscuzForum, 'page'>
{
	pageFrom: number,
	pageTo: number,
}

export interface IDiscuzForumThread
{
	tid: string,
	typeid: string,
	subject: string,
	dateline: number,
	author: string,
	authorid: string,
}

export type ITSPickExtra2<T, PK extends keyof T, RK extends Exclude<keyof T, PK> = Exclude<keyof T, PK>> =
	ITSRequiredPick<T, RK>
	& ITSPartialPick<T, PK>;

export interface IDiscuzThread extends ITSPickExtra<IDiscuzForumThread, 'tid'>
{
	thread_options?: IDzParamThreadOptions,

	pages: number,
	page: number,

	posts: IDiscuzPost[],

	thread_attach?: IDiscuzPostAttachRecord,

	post_pay?: {
		exixts: boolean,
	}
}

export interface IDiscuzThreadPickRange extends Omit<IDiscuzThread, 'page'>
{
	pageFrom: number,
	pageTo: number,
}

export interface IDzParamThreadOptions
{
	authorid?: string,
	page?: number,
	extra?: string,
	ordertype?: 1 | 0;
}

export interface IDzParamThreadOptions2 extends Omit<IDzParamThreadOptions, 'authorid'>
{
	tid: string | number,
	authorid?: string | number,
}

export const SymDzPost = Symbol.for('post');

export interface IDiscuzPostAttachItem
{
	aid: string,
	file: string,
}

export interface IDiscuzPostAttachRecord
{
	img: IDiscuzPostAttachItem[],
}

export interface IDiscuzPost
{
	pid: string;
	author?: string;
	authorid?: string;

	dateline?: number,
	last_edit?: number,

	[SymDzPost]?: JQuery<HTMLElement>;

	postmessage?: string,

	attach?: IDiscuzPostAttachRecord,

	post_pay?: {
		exixts: boolean,
	}
}

export type IDzParamForumdisplayFilter = 'dateline' | 'lastpost' | string;
export type IDzParamForumdisplayOrderby = 'dateline' | 'lastpost' | string;

export interface IDzParamForumdisplay
{
	fid: number | string,
	filter?: IDzParamForumdisplayFilter,
	orderby?: IDzParamForumdisplayOrderby,
	page?: number,
}

export interface IDiscuzTaskRow
{
	task_id: string,
	task_name: string,
	task_desc: string,
	task_credit: string,
}

export interface IDiscuzTaskList
{
	/**
	 * 無法接取的任務
	 */
	disallow: IDiscuzTaskRow[],
	/**
	 * 可以接取的任務
	 */
	allow: IDiscuzTaskRow[],
}

export type IDzParamNoticeView = 'system' | 'app' | 'interactive' | 'mypost';
