import { ParamMapAuto } from 'restful-decorator/lib/decorators/body';

export type IParametersSlice<T extends (...args: any) => any> = T extends (arg1: any, ...args: infer P) => any ? P : never;

export interface IDiscuzForumMini
{
	fid: number;
	forum_name: string;
}

export interface IDiscuzForum extends IDiscuzForumMini
{
	subforums: IDiscuzForumMini[]
}

export type IDzParamForumdisplayFilter = 'lastpost' | string;
export type IDzParamForumdisplayOrderby = 'lastpost' | string;

export interface IDzParamForumdisplay
{
	fid: number,
	filter?: IDzParamForumdisplayFilter,
	orderby?: IDzParamForumdisplayOrderby,
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
	disallow: IDiscuzTaskRow[],
	allow: IDiscuzTaskRow[],
}

export type IDzParamNoticeView = 'system' | 'app' | 'interactive' | 'mypost';
