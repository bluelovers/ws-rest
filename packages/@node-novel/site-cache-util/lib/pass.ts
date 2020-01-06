/**
 * Created by user on 2020/1/6.
 */
import { IPasswordLocal } from './types';
import { consoleDebug, path } from './index';

export async function importPassword<T extends IPasswordLocal>(name: string): Promise<T>
{
return import(name)
	.catch(e => {

		console.info(`importPassword:failed`, path.resolve(name));

		return {}
	})
}

export default importPassword
