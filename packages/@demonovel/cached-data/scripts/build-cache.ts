import { outputJSON, readJSON } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../lib/__root';
import buildCached from '../lib/all/cache';

export default readJSON(join(__rootCache, `pack`, `array.json`))
	.then(list => {
		return buildCached(list)
	})
;
