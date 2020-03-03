import { ISitesKeysAll, ISitesSourcePackAll, IRecordCachedJSONRow, IRecordSitesBuildAll } from '../../types';
import buildDemoNovel from '../demonovel/build';
import buildSites, { buildCore } from '../sites/build';
import Bluebird from 'bluebird';
import { ISitesKeys } from '../sites/types';

export function build(source: ISitesSourcePackAll)
{
	return Bluebird.resolve(Object.keys(source) as ISitesKeysAll[])
		.reduce(async (a, siteID) =>
		{

			switch (siteID)
			{
				case 'demonovel':
					a[siteID] = await buildDemoNovel(source[siteID])
					break;
				default:
					a[siteID] = await buildCore(siteID as ISitesKeys, source)
					break;
			}

			return a
		}, {} as IRecordSitesBuildAll)
		;
}

export default build
