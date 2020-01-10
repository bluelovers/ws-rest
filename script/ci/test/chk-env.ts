
import { console } from '@node-novel/site-cache-util';
import { assert, expect } from 'chai';

console.log(`try check secrets exists`);

[
	'GITHUB_ACTOR',
	'GITHUB_TOKEN',

	'MASIRO_USER',
	'MASIRO_PASS',

	'WENKU8_USER',
	'WENKU8_PASS',

].forEach(k => {

	console.log(k, k in process.env, process.env[k] && process.env[k].length)

});

assert('GITHUB_TOKEN' in process.env, `GITHUB_TOKEN not exists`);
