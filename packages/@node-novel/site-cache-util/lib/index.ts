import path from 'upath2';
import { ITSResolvable } from 'ts-type';
import Bluebird from 'bluebird';
import isCi from './ci';

if (isCi())
{
	process.env.FORCE_COLOR = process.env.FORCE_COLOR || '1';
}

import { console, consoleDebug } from 'restful-decorator/lib/util/debug';

export { path }
export { console, consoleDebug }

console.enabledColor = true;
consoleDebug.enabledColor = true;

if (isCi())
{
	//consoleDebug.enabled = false;

	let o = consoleDebug.inspectOptions || {};
	o.colors = true;
	consoleDebug.inspectOptions = o;

	let o2 = consoleDebug.chalkOptions || {};
	o2.enabled = true;
	o2.level = o2.level || 1;
	consoleDebug.chalkOptions = o2;
}

export function lazyImport<T = any>(name: string)
{
	consoleDebug.debug(`lazyImport`, name);
	return import(name).then(v => v.default as T)
}

export function lazyRun<T>(cb: (...argv: any) => ITSResolvable<T>, options?: {
	pkgLabel: string,
})
{
	let { pkgLabel } = options;

	if (!pkgLabel)
	{
		pkgLabel = `[lazyRun]`;
	}

	pkgLabel && consoleDebug.info(pkgLabel, 'start');

	return Bluebird.resolve().then(cb)
		.tap(async (v) => {
			pkgLabel && consoleDebug.info(pkgLabel, 'end');
		})
	;
}
