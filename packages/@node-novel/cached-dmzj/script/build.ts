/**
 * Created by user on 2019/7/28.
 */
import Bluebird from 'bluebird-cancellation';

(async () => {

	await lazyImport('./build/dmzj');
	await lazyImport('./build/info');
	await lazyImport('./build/tags');

})();

function lazyImport(name: string)
{
	return import(name).then(v => v.default)
}