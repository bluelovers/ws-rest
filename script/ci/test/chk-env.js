"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const site_cache_util_1 = require("@node-novel/site-cache-util");
const chai_1 = require("chai");
site_cache_util_1.console.log(`try check secrets exists`);
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
    'GITHUB_HEAD_REF',
    'GITHUB_BASE_REF',
    'GITHUB_EVENT_NAME',
    'GITHUB_REPOSITORY',
    'ACTIONS_CACHE_URL',
    'ACTIONS_RUNTIME_URL',
    'GITHUB_ACTION',
    'GITHUB_ACTIONS',
    'GITHUB_WORKFLOW',
    'GITHUB_WORKSPACE',
    //'GITHUB_CONTEXT',
    'ACTIONS_RUNNER_DEBUG',
    'ACTIONS_STEP_DEBUG',
    'ACTIONS_RUNTIME_TOKEN',
]);
ls2.forEach(k => {
    let bool = k in process.env;
    let value = process.env[k];
    site_cache_util_1.console.log(k, bool, bool && value.length);
    if (bool && !ls.includes(k)) {
        site_cache_util_1.console.log(k, '=', value);
    }
});
Object.keys(process.env)
    .filter(k => /github|action|event|secret|Runner|Worker/i.test(k) && !ls2.includes(k))
    .forEach((k) => {
    let bool = k in process.env;
    let value = process.env[k];
    site_cache_util_1.console.log(k, bool, bool && value.length);
});
ls.forEach(k => {
    chai_1.assert((k in process.env) && process.env[k].length, `${k} not exists`);
});
//# sourceMappingURL=chk-env.js.map