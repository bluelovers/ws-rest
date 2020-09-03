/**
 * Created by user on 2019/8/24.
 */

export interface IGeaderWithData<H, D>
{
	header: H;
	data: D[];
}

export interface ISearchSingle extends IGeaderWithData<ISearchSingleHeader, ISearchSingleDataRow>
{

}

export interface ISearchSingleHeader
{
	title: string;
	num: number;
	limit: number;
}

export interface ISearchSingleDataRow
{
	primary: string;
	secondary: string;
	image: string;
	onclick: string;
}

export interface ISearchSingleDataRowPlus extends ISearchSingleDataRow
{
	href: string,
	path: string,
	id_key: string,
}

export interface IMangaData
{
	id_key: string;

	title: string,
	other_names: string,

	cover: string,

	authors: string[],
	tags: string[],
	magazine: string[],

	chapters: IMangaChapter[];
}

export interface IMangaChapter
{
	id_key: string;
	chapter_id: string;
}

export interface IMangaReadData extends IMangaChapter
{
	images: string[];
}

export type IMangaListOptionsSort = 'name' | 'views' | 'last_update';
export type IMangaListOptionsSortType = 'ASC' | 'DESC';

export interface IMangaListOptions
{
	listType?: 'pagination' | string;
	page?: string | number;
	artist?: string;
	author?: string;
	group?: string;
	m_status?: string;
	name?: string;
	genre?: string;
	ungenre?: string;
	sort?: IMangaListOptionsSort;
	sort_type?: IMangaListOptionsSortType;
}

export interface IMangaListRow
{
	id: string,
	id_key: string,
	title: string,
	last_chapter: IMangaChapter,
}

export interface IMangaList
{
	page: string,
	page_max: string,
	query: IMangaListOptions,
	list: IMangaListRow[],
}
