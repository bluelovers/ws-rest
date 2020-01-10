
import { console } from '@node-novel/site-cache-util';
import { assert, expect } from 'chai';

console.log(`try check secrets exists`);

let ls = [

	'GITHUB_ACTOR',
	'GITHUB_TOKEN',

	'MASIRO_USER',
	'MASIRO_PASS',

	'WENKU8_USER',
	'WENKU8_PASS',

];

ls.concat([

	'GITHUB_SHA',
	'GITHUB_REF',

]).forEach(k => {

	console.log(k, k in process.env, process.env[k] && process.env[k].length)

});

ls.forEach(k => {

	assert((k in process.env) && process.env[k].length, `${k} not exists`);

});
