import { ISitesSourcePackAll, IRecordSitesBuildAll } from '../../types';
import Bluebird from 'bluebird';
export declare function build(source: ISitesSourcePackAll): Bluebird<IRecordSitesBuildAll>;
export default build;
