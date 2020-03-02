/**
 * Created by user on 2020/3/2.
 */

import fetchFileDemoNovel from '../demonovel';
import fetchFileDemoSites from '../sites';
import Bluebird from 'bluebird';
import { IFetchParams } from '../sites/types';

export default function fetchFileAll(force?: boolean, opts?: IFetchParams)
{
	return Bluebird.props({
			a: fetchFileDemoSites(force, opts),
			b: fetchFileDemoNovel(force),
		})
		.then(async (data) =>
		{
			return {
				...data.a,
				...data.b,
			}
		})
		;
}
