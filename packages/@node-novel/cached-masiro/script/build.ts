/**
 * Created by user on 2019/7/7.
 */

export default (async () => {

	await lazyImport('./build/toplist');

	//await lazyImport('./build/task001');

	//await lazyImport('./build/merge');

	//await lazyImport('./build/cache');

	await lazyImport('./build/task_logined');

})();

function lazyImport(name: string)
{
	return import(name).then(v => v.default)
}
