import { IArrayCachedJSONRow, IRecordCachedJSONRow } from '../types';

export function _handle(list: IArrayCachedJSONRow)
{
	return list.sort((a, b) =>
	{
		return b.updated - a.updated
	});
}

export function toRecord(list: IArrayCachedJSONRow)
{
	list = _handle(list);

	let record = list
		.reduce((a, b) =>
		{
			a[b.uuid] = b;
			return a;
		}, {} as IRecordCachedJSONRow)

	return record
}

export function toArray(record: IRecordCachedJSONRow): IArrayCachedJSONRow
{
	let list = Object.values(record)

	list = _handle(list);

	return list
}
