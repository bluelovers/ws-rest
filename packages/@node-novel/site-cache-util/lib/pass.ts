/**
 * Created by user on 2020/1/6.
 */
import { IPasswordLocal } from './types';
import { console, consoleDebug, path } from './index';
import envBool, { envVal } from 'env-bool';

export async function importPassword<T extends IPasswordLocal>(options: {
	file: string,
	__root: string,
	envPrefix?: string,
}): Promise<T>
{
	let target = path.join(options.__root, options.file);

return import(target)
	.catch(e => {
		let { envPrefix } = options;

		if (envPrefix)
		{
			envPrefix = envPrefix.toUpperCase();

			let username = process.env[`${envPrefix}_USER`];
			let password = process.env[`${envPrefix}_PASS`];

			let DISABLE_LOGIN = envBool(process.env[`${envPrefix}_DISABLE_LOGIN`]);

			if (username && password)
			{
				return <IPasswordLocal>{
					DISABLE_LOGIN,
					default: {
						username,
						password,
					}
				}
			}
		}

		console.red.info(`importPassword:failed`, target);

		return {}
	})
}

export default importPassword
