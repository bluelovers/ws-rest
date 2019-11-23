/**
 * Created by user on 2019/11/24.
 */

export interface IWenku8RecentUpdate
{
	page: number;
	end: number;
	last_update_time: number;
	data: IWenku8RecentUpdateRow[];
}

export type IArticleToplistSortType = 'lastupdate' | 'postdate' | 'anime' | 'allvisit';

export interface IWenku8RecentUpdateWithSortType extends IWenku8RecentUpdate
{
	sort: IArticleToplistSortType,
}

export interface IWenku8RecentUpdateCache extends Omit<IWenku8RecentUpdate, 'page'>
{
	from: number,
	to: number,
	size: number,
}

export interface IWenku8RecentUpdateRow
{
	id: string;
	cid: string;
	name: string;
	authors: string,
	/**
	 * 出版商
	 */
	publisher: string,
	status: string,
	cover: string;
	last_update_time: number;
	last_update_chapter_name: string;
}
