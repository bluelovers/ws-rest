/**
 * Created by user on 2019/11/24.
 */

export interface IESJzoneRecentUpdate
{
	page: number;
	end: number;
	last_update_time: number;
	data: IESJzoneRecentUpdateRow[];
}

export interface IESJzoneRecentUpdateCache extends Omit<IESJzoneRecentUpdate, 'page'>
{
	from: number,
	to: number,
	size: number,
}

interface _IESJzoneRecentUpdateRow extends IESJzoneBookInfoMini
{
	cover: string;
	last_update_time?: number;
	last_update_chapter_name?: string;
}

export interface IESJzoneRecentUpdateRow extends Omit<_IESJzoneRecentUpdateRow, 'authors'>
{
	cover: string;
	last_update_time?: number;
	last_update_chapter_name?: string;
}

export interface IESJzoneRecentUpdateRowBook extends _IESJzoneRecentUpdateRow
{
	desc: string,

	chapters: IESJzoneBookChaptersVol[],

	links: IESJzoneLinkExternal[],

	tags: string[],
}

export interface IESJzoneLinkExternal
{
	name?: string;
	href: string,
}

export interface IESJzoneBookInfoMini
{
	id: string;
	name: string;
	authors: string,
}

export interface IESJzoneBookChapters extends IESJzoneBookInfoMini
{
	chapters: IESJzoneBookChaptersVol[],
}

export interface IESJzoneBookChaptersVol
{
	volume_order: number,
	volume_name: string,

	chapters: (IESJzoneBookChaptersVolChapter | IESJzoneBookChaptersVolChapterExternal)[],
}

export interface IESJzoneRecentUpdateRowBookWithChapters extends IESJzoneRecentUpdateRowBook, Pick<IESJzoneBookChapters, 'chapters'>
{

}

export interface IESJzoneBookChaptersVolChapter
{
	novel_id: string,
	"chapter_id": string,
	"chapter_name": string,
	"chapter_order": number,
	"chapter_link": string,
}

export interface IESJzoneBookChaptersVolChapterExternal extends Omit<IESJzoneBookChaptersVolChapter, 'chapter_id' | 'novel_id'>
{
	"chapter_id"?: never,
	"novel_id"?: never,
}

export type IParametersSlice<T extends (...args: any) => any> = T extends (arg1: any, ...args: infer P) => any ? P : never;
