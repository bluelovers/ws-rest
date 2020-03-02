/**
 * Created by user on 2020/3/2.
 */
import { stat, readJSON } from 'fs-extra';
import Bluebird from 'bluebird';

export function readJSONWithFetch<T>(file: string, fetch: () => Promise<T>, force?: boolean): Bluebird<T>
{
	return Bluebird.resolve()
		.then(async () => {

			if (typeof force === "boolean" && !force)
			{
				let st = await stat(file)
					.catch(e => null)
				;

				if (st && (Date.now() - st.mtimeMs) < 12 * 60 * 60 * 1000)
				{
					return readJSON(file)
				}
			}

			return Promise.reject()
		})
		.catch(e => fetch())
		.catch(e => readJSON(file))
	;
}
