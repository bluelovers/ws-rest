/**
 * Created by user on 2020/1/6.
 */
import { IPasswordLocal } from './types';
import { console, consoleDebug, path } from './index';

export async function importPassword<T extends IPasswordLocal>(name: string, __root: string): Promise<T>
{
	let target = path.join(__root, name);

return import(target)
	.catch(e => {

		console.red.info(`importPassword:failed`, target);

		return {}
	})
}

export default importPassword
