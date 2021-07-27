import { ISitesKeys, ISitesSourcePack, IEntryHandler } from './types';
import { handleEntries } from './build/util';
import Bluebird from 'bluebird';
import buildEsjzone from './build/esjzone';
import buildDefault from './build/default';
import buildMasiro from './build/masiro';
import { EnumSiteID, ICachedJSONRowPlus, IRecordCachedJSONRow } from '@demonovel/cached-data-types';
import { buildMasiroMe } from './build/masiro_me';

export function buildCore<K extends ISitesKeys>(siteID: K, source: ISitesSourcePack)
{
	let fn: IEntryHandler;

	switch (siteID) {
		case 'esjzone':
			fn = buildEsjzone
			break;
		case 'dmzj':
		case 'wenku8':
			fn = buildDefault
			break;
		case 'masiro':
			fn = buildMasiro
			break;
		case 'masiro_me':
			fn = buildMasiroMe
			break;
	}

	return handleEntries(siteID, source, fn);
}

export function build(source: ISitesSourcePack)
{
	return Bluebird
		.resolve(Object.keys(source) as ISitesKeys[])
		.reduce((a, siteID) => {

			a[siteID] = buildCore(siteID, source);

			return a;
		}, {} as Record<ISitesKeys, IRecordCachedJSONRow>)
}

export default buildCore
