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
}
