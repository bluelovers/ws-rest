
import { console } from '@node-novel/site-cache-util';

console.log(`try check secrets exists`);

[
	'GITHUB_ACTOR',
	'GITHUB_TOKEN',

	'MASIRO_USER',
	'MASIRO_PASS',

	'WENKU8_USER',
	'WENKU8_PASS',

].forEach(k => {

	console.log(k, k in process.env)

});
