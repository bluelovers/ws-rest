import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import { deepEqual, notDeepEqual } from 'assert';
import { assert, expect } from 'chai';
import { console } from '@node-novel/site-cache-util';

let input = `2020-01-01`;
let input_timestamp = 1577808000;

[
	moment(input),
	toMoment(input),
	toMoment(input).utcOffset(480),
	toMoment(input).utcOffset(0),
	unixMoment(1577808000),
	unixMoment(1577808000).utcOffset(480),
	toMoment(),
	moment(),
].forEach((m, i) => {
	console.log(`${i} ===================`)
	console.dir(m.format());
	console.dir(m.unix());
	console.dir(m.utcOffset());
});

expect(toMoment(input).utcOffset(480).unix())
	.to.deep.equal(input_timestamp)
;

expect(toMoment(input).unix())
	.to.deep.equal(input_timestamp)
;

expect(moment(input).utcOffset(480).unix())
	.to.deep.equal(input_timestamp)
;

expect(moment(input).unix())
	.to.deep.equal(input_timestamp)
;

//console.dir(moment)
