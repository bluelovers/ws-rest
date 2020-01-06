import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import { deepEqual } from 'assert';
import { assert, expect } from 'chai';
import { console } from '@node-novel/site-cache-util';

let input = `2020-01-01`;
let input_timestamp = 1577808000;

console.dir(toMoment(input).utcOffset(480).unix());
console.dir(toMoment(input).utcOffset(0).unix());

console.dir(toMoment(input).utcOffset(480).format());
console.dir(toMoment(input).utcOffset(0).format());

console.dir(unixMoment(1577808000).format());
console.dir(unixMoment(1577808000).utcOffset(480).format());

console.dir(toMoment().utcOffset());

expect(toMoment(input).utcOffset(480).unix())
	.to.deep.equal(input_timestamp)
;

//console.dir(moment)
