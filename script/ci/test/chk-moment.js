"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const chai_1 = require("chai");
const site_cache_util_1 = require("@node-novel/site-cache-util");
let input = `2020-01-01`;
let input_timestamp = 1577808000;
[
    moment_1.moment(input),
    moment_1.toMoment(input),
    moment_1.toMoment(input).utcOffset(480),
    moment_1.toMoment(input).utcOffset(0),
    moment_1.unixMoment(1577808000),
    moment_1.unixMoment(1577808000).utcOffset(480),
    moment_1.toMoment(),
    moment_1.moment(),
].forEach((m, i) => {
    site_cache_util_1.console.log(`${i} ===================`);
    site_cache_util_1.console.dir(m.format());
    site_cache_util_1.console.dir(m.unix());
    site_cache_util_1.console.dir(m.utcOffset());
});
chai_1.expect(moment_1.toMoment(input).utcOffset(480).unix())
    .to.deep.equal(input_timestamp);
chai_1.expect(moment_1.toMoment(input).unix())
    .to.deep.equal(input_timestamp);
chai_1.expect(moment_1.moment(input).utcOffset(480).unix())
    .to.deep.equal(input_timestamp);
chai_1.expect(moment_1.moment(input).unix())
    .to.deep.equal(input_timestamp);
//console.dir(moment)
//# sourceMappingURL=chk-moment.js.map