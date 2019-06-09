/**
 * Created by user on 2019/6/9.
 */
import LazyURLSearchParams from '../index';
import assert from 'assert';

let u = new LazyURLSearchParams({
	nickname: 'xxxxxxx',
	passwd: {k:'xxxxxxx'}
});

console.dir(u.toString());

assert.deepStrictEqual(u.toString(), 'nickname=xxxxxxx&passwd=%7B%22k%22%3A%22xxxxxxx%22%7D');

u = new LazyURLSearchParams();

u.push(...Object.entries({
	nickname: 'xxxxxxx',
	passwd: {k:'xxxxxxx'}
}));

console.dir(u.toString());

assert.deepStrictEqual(u.toString(), 'nickname=xxxxxxx&passwd=%7B%22k%22%3A%22xxxxxxx%22%7D');

u = new LazyURLSearchParams();

u.extend({
	nickname: 'xxxxxxx',
	passwd: {k:'xxxxxxx'}
});

console.dir(u.toString());

assert.deepStrictEqual(u.toString(), 'nickname=xxxxxxx&passwd=%7B%22k%22%3A%22xxxxxxx%22%7D');
