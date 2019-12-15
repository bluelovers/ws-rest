/**
 * Created by user on 2019/7/7.
 */

export default (async () => {

	await lazyImport('./build/toplist');

	//await lazyImport('./build/task001');

	//await lazyImport('./build/merge');

	//await lazyImport('./build/cache');

})();

function lazyImport(name: string)
{
	return import(name).then(v => v.default)
}
