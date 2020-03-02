/**
 * Created by user on 2020/3/2.
 */

import fetchFileAll from '../lib/all/index';
import fetchFile from '../lib/sites/core';
import Bluebird from 'bluebird';
import build from '../lib/all/build';
import { outputJSON, outputFile } from 'fs-extra';
import { join } from "path";
import { __rootCacheBuild, __rootCache } from '../lib/__root';
import stableStringify from "@wincent/stable-stringify";
import { toArray, _handle, toRecord } from '../lib/util/convert';
import { IArrayCachedJSONRow } from '../lib/types';

fetchFileAll(false, {
	local: true,
})
	.then(data => {
		return build(data)
	})
	.tap(data => {
		return Bluebird.resolve(Object.keys(data))
			.map(siteID => {

				return outputJSON(join(__rootCacheBuild, `${siteID}.json`), data[siteID])
			})
		;
	})
	.tap(data => {

		return Bluebird.resolve(Object.keys(data))
			.reduce((a, b) => {

				a.push(...Object.values(data[b]));

				return a;
			}, [] as IArrayCachedJSONRow)
			.then(list => _handle(list))
			.tap(list => {
				return Promise.all([
					outputJSON(join(__rootCache, `pack`, `array.json`), list),
					outputJSON(join(__rootCache, `pack`, `record.json`), toRecord(list)),
				])
			})
		;

	})
;
