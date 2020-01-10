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

let ls2 = ls.concat([

	'GITHUB_SHA',
	'GITHUB_REF',

	'GITHUB_EVENT_NAME',
	'GITHUB_REPOSITORY',

	'ACTIONS_CACHE_URL',
	'ACTIONS_RUNTIME_URL',

]);

ls2.forEach(k => {

	let bool = k in process.env;
	let value = process.env[k];

	console.log(k, bool, bool && value.length);

	if (bool && !ls.includes(k))
	{
		console.log(k, '=', value)
	}

});

Object.keys(process.env)
	.filter(k => /github|action|event|secret/i.test(k) && !ls2.includes(k))
	.forEach((k) => {

		let bool = k in process.env;
		let value = process.env[k];

		console.log(k, bool, bool && value.length);

	})
;

ls.forEach(k => {

	assert((k in process.env) && process.env[k].length, `${k} not exists`);

});
