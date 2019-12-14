import path from 'upath2';
import { console, consoleDebug } from 'restful-decorator/lib/util/debug';

export { path }
export { console, consoleDebug }

console.enabledColor = true;
consoleDebug.enabledColor = true;

export function lazyImport<T = any>(name: string)
{
	return import(name).then(v => v.default as T)
}
