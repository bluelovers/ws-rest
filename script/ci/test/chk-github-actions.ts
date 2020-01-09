
import { console } from '@node-novel/site-cache-util';

console.log(`try check secrets exists`);

[
	'GITHUB_TOKEN',
].forEach(k => {

	console.log(k, k in process.env)

});
