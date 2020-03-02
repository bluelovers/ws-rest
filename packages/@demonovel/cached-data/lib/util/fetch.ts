import { join } from "path";
import { outputJSON } from 'fs-extra';
import fetch from "cross-fetch";

import { axios } from 'restful-decorator/lib/types/axios';
import Bluebird from 'bluebird';

export function fetchCache<T>(url: string, file: string)
{
	return Bluebird.resolve()
		.then(e => {

			/*
			axios.get( url, {
				responseType: 'json',
				timeout: 1000,
				raxConfig: {
					retry: 1,
					noResponseRetries: 1,
				},
			})
			then(r => r.data)
			 */

			return fetch(url, {
				// @ts-ignore
				timeout: 1000,
			})
				.then(async (r) => {
					if (r.status >= 400)
					{
						return Promise.reject()
					}
					return r.json();
				})
		})
		.timeout(5 * 1000)
		.then<T>(async (data) =>
		{
			await outputJSON(file, data, {
				spaces: 0,
			});

			return data
		})
		;
}

export default fetchCache
