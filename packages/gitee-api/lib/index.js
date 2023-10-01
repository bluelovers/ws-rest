"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiteeV5Client = exports.GITEE_SCOPES = void 0;
const tslib_1 = require("tslib");
const lib_1 = require("restful-decorator/lib");
const decorators_1 = require("restful-decorator/lib/decorators");
const lazy_url_1 = tslib_1.__importDefault(require("lazy-url"));
const lodash_1 = require("lodash");
const headers_1 = require("restful-decorator/lib/decorators/headers");
const error_1 = require("restful-decorator/lib/wrap/error");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("./util");
const decorators_2 = require("./decorators");
// @ts-ignore
const deep_eql_1 = tslib_1.__importDefault(require("deep-eql"));
const SymApiOptions = Symbol('options');
exports.GITEE_SCOPES = Object.freeze('user_info projects pull_requests issues notes keys hook groups gists enterprises'.split(' '));
let GiteeV5Client = exports.GiteeV5Client = class GiteeV5Client extends lib_1.AbstractHttpClient {
    static allScope() {
        return exports.GITEE_SCOPES.slice();
    }
    constructor(options) {
        super(options.defaults, options);
    }
    _init(defaults, options) {
        //let { scope = 'user_info issues notes', clientId, clientSecret, state = 'all' } = options || {};
        let { scope, clientId, clientSecret, state, redirect_uri } = options || {};
        defaults = super._init(defaults);
        this[SymApiOptions] = Object.assign(this[SymApiOptions] || {}, options, {
            scope,
            clientId,
            clientSecret,
            state,
            redirect_uri,
        });
        return defaults;
    }
    setAccessToken(accessToken) {
        this.$http.defaults.headers.Authorization = (0, headers_1._makeAuthorizationValue)(accessToken, "token" /* EnumAuthorizationType.Token */);
        return this;
    }
    requestAccessToken(code, redirect_uri, redirect_uri2) {
        let url = new lazy_url_1.default('/oauth/token', this.$baseURL);
        let { state, scope, clientSecret, clientId } = this[SymApiOptions];
        let data = new URLSearchParams();
        data.set('client_id', clientId);
        data.set('client_secret', clientSecret);
        data.set('code', code);
        data.set('grant_type', 'authorization_code');
        data.set('redirect_uri', this.redirectUrl(redirect_uri, redirect_uri2).toRealString());
        return bluebird_1.default.resolve(this.$http({
            url: url.toRealString(),
            method: 'POST',
            data,
        }))
            .then(r => r.data)
            .catch(e => {
            if (e.response.data.error) {
                return bluebird_1.default.reject(e.response.data);
            }
            return bluebird_1.default.reject(e);
        });
    }
    refreshAccessToken(refresh_token) {
        return null;
    }
    oauthTokenByPassword(loginData) {
        return null;
    }
    redirectUrl(redirect_uri, redirect_uri2) {
        let url = new lazy_url_1.default('/oauth/authorize', this.$baseURL);
        if (redirect_uri == null) {
            if (!_hasWindow() && (typeof this[SymApiOptions].redirect_uri === 'string')) {
                redirect_uri = this[SymApiOptions].redirect_uri;
            }
            else {
                // @ts-ignore
                redirect_uri = window.location.href;
            }
        }
        else if (typeof redirect_uri != 'string') {
            redirect_uri = redirect_uri.toString();
        }
        if (redirect_uri2) {
            redirect_uri = new lazy_url_1.default(redirect_uri);
            redirect_uri.searchParams.set('_redirect_uri_', redirect_uri2.toString());
            redirect_uri = redirect_uri.toString();
        }
        let { state, scope, clientSecret, clientId } = this[SymApiOptions];
        url.searchParams.set('client_id', clientId);
        url.searchParams.set('redirect_uri', redirect_uri);
        scope && url.searchParams.set('scope', scope);
        state && url.searchParams.set('state', state);
        url.searchParams.set('response_type', 'code');
        return url;
    }
    /**
     * 瀏覽器 only
     */
    redirectAuth(redirect_uri, redirect_uri2, target = 'self') {
        // @ts-ignore
        return window.open(this.redirectUrl(redirect_uri).toString(), redirect_uri2, target || 'self');
    }
    repoContents(setting, isFile) {
        return;
    }
    /**
     * 获取文件Blob
     */
    repoContentsBlobs(setting, autoDecode) {
        if (autoDecode) {
            let data = this.$returnValue;
            data.content = data.content.replace(/\n$/, '');
            let buffer = Buffer.from(data.content, data.encoding);
            return bluebird_1.default.resolve({
                ...data,
                buffer: buffer,
            });
        }
        return;
    }
    repoContentsCreate(setting) {
        return;
    }
    repoContentsUpdate(setting) {
        return;
    }
    userKeys(page, per_page) {
        //console.dir(777);
        //return this.$returnValue.data as any
        return;
    }
    /**
     * 获取仓库的Commit评论
     */
    repoCommitCommentsAll(setting) {
        return;
    }
    /**
     * 获取单个Commit的评论
     */
    repoCommitComments(setting) {
        return;
    }
    /**
     * 获取仓库的某条Commit评论
     */
    repoCommitCommentByID(setting) {
        return;
    }
    repoInfo(setting) {
        return;
    }
    /**
     * 查看仓库的Forks
     */
    repoForks(setting) {
        return;
    }
    /**
     * Fork一个仓库 (原始 api)
     */
    _forkRepo(setting) {
        return;
    }
    /**
     * Fork一个仓库 當發生錯誤時 試圖搜尋已存在的 fork
     * 如果需要使用原始 api 請用 `_forkRepo`
     */
    forkRepo(options) {
        return this._forkRepo(options)
            .catch(async (e) => {
            try {
                let code = e.response.status;
                let data = e.response.data;
                if (code == 403 || data.message === '已经存在同名的仓库, Fork 失败') {
                    let owner;
                    if (options.organization) {
                        owner = options.organization;
                    }
                    else {
                        let useInfo = await this.userInfo();
                        owner = useInfo.login;
                    }
                    let repoInfo = await this.repoInfo({
                        owner,
                        repo: options.repo,
                    });
                    if ((0, util_1.isForkFrom)(repoInfo, options)) {
                        return repoInfo;
                    }
                }
                else if (code == 400 || data.message === '已经Fork，不允许重复Fork') {
                    let repoInfo;
                    if (options.organization) {
                        repoInfo = await this.orgHasFork({
                            org: options.organization,
                        }, {
                            repo: options.repo,
                            owner: options.owner,
                        });
                    }
                    else {
                        repoInfo = await this.myHasFork({}, {
                            repo: options.repo,
                            owner: options.owner,
                        });
                    }
                    if (repoInfo) {
                        return repoInfo;
                    }
                }
            }
            catch (e2) {
            }
            return bluebird_1.default.reject(e);
        });
    }
    /**
     * 判断用户是否为仓库成员
     */
    isRepoCollaborators(setting) {
        if (this.$returnValue === '') {
            return true;
        }
        return;
    }
    searchIssues(setting) {
        return;
    }
    /**
     * 两个Commits之间对比的版本差异
     */
    compareCommits(setting) {
        return;
    }
    pullRequestCreate(setting) {
        return;
    }
    repoBranchInfo(setting) {
        return this.repoBranchList(setting);
    }
    repoBranchList(setting) {
        return;
    }
    /**
     * 建立一個分支 (允許將 refs 設定為他人的 repo 下的 commit)
     */
    repoBranchCreate(setting) {
        return;
    }
    /**
     * 建立一個來自他人 repo 分支的分支
     */
    repoBranchCreateByOtherRepo(setting, fromTarget) {
        return this
            .repoBranchInfo(fromTarget)
            .then(ret => {
            return this.repoBranchCreate({
                ...setting,
                refs: ret.commit.sha,
            });
        });
    }
    userInfo() {
        return null;
    }
    /**
     * 获取某个用户的公开仓库
     */
    usersUsernameRepos(options) {
        return null;
    }
    /**
     * 获取一个组织的仓库
     */
    orgsRepos(options) {
        return null;
    }
    /**
     * 列出授权用户的所有仓库
     */
    myRepoList(options) {
        return null;
    }
    userForks(options) {
        if (options.type == null) {
            options.type = 'owner';
        }
        return this.usersUsernameRepos(options)
            .then(ls => {
            if (ls) {
                return (0, util_1.valueToArray)(ls).filter(repo => repo.fork);
            }
            return ls;
        });
    }
    orgsForks(options) {
        return this.orgsRepos(options)
            .then(ls => {
            if (ls) {
                return (0, util_1.valueToArray)(ls).filter(repo => repo.fork);
            }
            return ls;
        });
    }
    myForks(options) {
        if (options.type == null) {
            options.type = 'owner';
        }
        return this.myRepoList(options)
            .then(ls => {
            if (ls) {
                return (0, util_1.valueToArray)(ls).filter(repo => repo.fork);
            }
            return ls;
        });
    }
    _hasFork(fn, userOptions, targetRepoOptions, cache) {
        if (userOptions.type == null) {
            userOptions.type = 'owner';
        }
        // @ts-ignore
        if (userOptions.sort == null) {
            // @ts-ignore
            userOptions.sort = 'updated';
        }
        cache = (0, lodash_1.defaultsDeep)(cache || {}, {});
        return fn(userOptions, targetRepoOptions)
            .then(ls => {
            if (ls && ls.length && !(0, deep_eql_1.default)(ls, cache.last)) {
                for (let row of ls) {
                    if ((0, util_1.isForkFrom)(row, targetRepoOptions)) {
                        return row;
                    }
                }
                const { page = 1 } = userOptions;
                //cache.last2 = ls;
                cache.last = ls;
                return this._hasFork(fn, {
                    ...userOptions,
                    page: page + 1,
                }, targetRepoOptions, cache);
            }
            return null;
        });
    }
    userHasFork(userOptions, targetRepoOptions) {
        return this._hasFork(this.userForks.bind(this), {
            ...userOptions
        }, {
            ...targetRepoOptions
        });
    }
    orgHasFork(orgOptions, targetRepoOptions) {
        let type = orgOptions.type || 'all';
        return this._hasFork(this.orgsForks.bind(this), {
            ...orgOptions,
            type,
        }, {
            ...targetRepoOptions
        });
    }
    myHasFork(userOptions, targetRepoOptions) {
        return this._hasFork(this.myForks.bind(this), {
            ...userOptions
        }, {
            ...targetRepoOptions
        });
    }
};
tslib_1.__decorate([
    (0, decorators_1.POST)('/oauth/token'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.BodyData)({
        grant_type: 'authorization_code',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "requestAccessToken", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('/oauth/token'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.BodyData)({
        grant_type: 'refresh_token',
    }),
    (0, decorators_1.methodBuilder)({
        returnData: true,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamData)('refresh_token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "refreshAccessToken", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('/oauth/token'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.BodyData)({
        grant_type: 'password',
    }),
    (0, decorators_1.methodBuilder)(function (info) {
        // @ts-ignore
        let { state, scope, clientSecret, clientId } = info.thisArgv[SymApiOptions];
        info.requestConfig.data.client_id = clientId;
        info.requestConfig.data.client_secret = clientSecret;
        if (!info.requestConfig.data.scope && scope) {
            info.requestConfig.data.scope = scope;
        }
        return info;
    }, {
        returnData: true,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "oauthTokenByPassword", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('/api/v5/repos/{owner}/{repo}/contents{/targetPath}'),
    (0, decorators_1.methodBuilder)({
        returnData: true,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Boolean]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoContents", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/git/blobs/{sha}'),
    (0, decorators_1.methodBuilder)({
        returnData: true,
    })
    /**
     * 获取文件Blob
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Boolean]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoContentsBlobs", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('repos/{owner}/{repo}/contents{targetPath}'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.TransformRequest)(function base64(data) {
        if (data.content) {
            data.content = (0, util_1.toBase64)(data.content);
        }
        return data;
    }),
    (0, decorators_1.methodBuilder)(),
    (0, decorators_2.CatchResponseDataError)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", bluebird_1.default)
], GiteeV5Client.prototype, "repoContentsCreate", null);
tslib_1.__decorate([
    (0, decorators_1.PUT)('repos/{owner}/{repo}/contents/{targetPath}'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.TransformRequest)(function base64(data) {
        if (data.content) {
            data.content = (0, util_1.toBase64)(data.content);
        }
        return data;
    }),
    (0, decorators_1.methodBuilder)({
        returnData: true,
    }),
    (0, decorators_1.CatchError)(function (e) {
        return bluebird_1.default.reject((0, error_1.mergeAxiosErrorWithResponseData)(e));
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", bluebird_1.default)
], GiteeV5Client.prototype, "repoContentsUpdate", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('user/keys'),
    (0, decorators_1.methodBuilder)({
        returnData: true,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamData)('page')),
    tslib_1.__param(1, (0, decorators_1.ParamData)('per_page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "userKeys", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/comments'),
    (0, decorators_1.methodBuilder)()
    /**
     * 获取仓库的Commit评论
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoCommitCommentsAll", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/commits/{ref}/comments'),
    (0, decorators_1.methodBuilder)()
    /**
     * 获取单个Commit的评论
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoCommitComments", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/comments/{id}'),
    (0, decorators_1.methodBuilder)()
    /**
     * 获取仓库的某条Commit评论
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoCommitCommentByID", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoInfo", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/forks'),
    (0, decorators_1.methodBuilder)()
    /**
     * 查看仓库的Forks
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoForks", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('repos/{owner}/{repo}/forks'),
    (0, decorators_1.methodBuilder)()
    /**
     * Fork一个仓库 (原始 api)
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "_forkRepo", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/collaborators/{username}'),
    (0, decorators_1.methodBuilder)(),
    (0, decorators_1.CatchError)(function (e) {
        if (e.response.data.message === "404 Not Found") {
            return false;
        }
        return bluebird_1.default.reject(e);
    })
    /**
     * 判断用户是否为仓库成员
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "isRepoCollaborators", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('search/issues'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "searchIssues", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/compare/{base}...{head}'),
    (0, decorators_1.methodBuilder)()
    /**
     * 两个Commits之间对比的版本差异
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "compareCommits", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('repos/{owner}/{repo}/pulls'),
    (0, decorators_1.methodBuilder)(),
    (0, decorators_1.CatchError)(function (e) {
        if (e.response.data.message === "Target branch源分支与目标分支一致，无法发起PR。") {
            return bluebird_1.default.reject(e.response.data);
        }
        return bluebird_1.default.reject(e);
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "pullRequestCreate", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/branches/{branch}')
    // @ts-ignore
    ,
    (0, decorators_1.HandleParamMetadata)((info) => {
        let [setting] = info.argv;
        if (!setting.branch) {
            throw new TypeError(`branch should not to empty ${JSON.stringify(setting.branch)}`);
        }
        return info;
    }),
    (0, decorators_1.methodBuilder)({
        autoRequest: false,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)({
        branch: 'master',
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoBranchInfo", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('repos/{owner}/{repo}/branches{/branch}'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoBranchList", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('repos/{owner}/{repo}/branches'),
    (0, decorators_1.methodBuilder)(),
    (0, decorators_2.CatchResponseDataError)()
    /**
     * 建立一個分支 (允許將 refs 設定為他人的 repo 下的 commit)
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "repoBranchCreate", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('repos/{owner}/{repo}/branches'),
    (0, decorators_1.methodBuilder)({
        autoRequest: false,
    })
    /**
     * 建立一個來自他人 repo 分支的分支
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GiteeV5Client.prototype, "repoBranchCreateByOtherRepo", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('user'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "userInfo", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('users/{username}/repos'),
    (0, decorators_1.methodBuilder)()
    /**
     * 获取某个用户的公开仓库
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "usersUsernameRepos", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('users/{username}/repos'),
    (0, decorators_1.methodBuilder)()
    /**
     * 获取一个组织的仓库
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "orgsRepos", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('user/repos'),
    (0, decorators_1.methodBuilder)(),
    (0, decorators_1.HandleParamMetadata)((info) => {
        let [setting] = info.argv;
        if (setting && setting.affiliation) {
            if (Array.isArray(setting.affiliation)) {
                setting.affiliation = setting.affiliation(',');
            }
        }
        return info;
    })
    /**
     * 列出授权用户的所有仓库
     */
    ,
    tslib_1.__param(0, (0, decorators_1.ParamMapQuery)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], GiteeV5Client.prototype, "myRepoList", null);
exports.GiteeV5Client = GiteeV5Client = tslib_1.__decorate([
    (0, decorators_1.BaseUrl)('https://gitee.com/api/v5/'),
    (0, decorators_1.Headers)({
        'Accept': 'application/json',
    }),
    (0, decorators_1.RequestConfigs)({
        responseType: 'json',
    }),
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 15 * 60 * 1000,
        },
    })
    /**
     * @see https://gitee.com/api/v5/oauth_doc
     * @link https://gitee.com/api/v5/swagger
     *
     * @todo 好一點的方法命名
     */
    ,
    tslib_1.__metadata("design:paramtypes", [Object])
], GiteeV5Client);
function _hasWindow() {
    try {
        // @ts-ignore
        if (window.location) {
            return true;
        }
    }
    catch (e) {
    }
    return false;
}
exports.default = GiteeV5Client;
//# sourceMappingURL=index.js.map