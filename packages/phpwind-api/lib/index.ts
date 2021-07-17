import { CacheRequest } from 'restful-decorator/lib/decorators/config/cache';
import AbstractHttpClientWithJSDom, { IJSDOM } from 'restful-decorator-plugin-jsdom/lib';
import { AbstractHttpClient, IBluebird } from 'restful-decorator/lib';
import { POST, GET } from 'restful-decorator/lib/decorators/method';
import { FormUrlencoded } from 'restful-decorator/lib/decorators/form';
import { methodBuilder } from 'restful-decorator/lib/wrap/abstract';
import { ParamMapAuto, ParamPath } from 'restful-decorator/lib/decorators/body';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import { _checkLoginUsername, _checkLoginByJQuery } from './util/jquery/_checkLogin';
import Bluebird from 'bluebird';
import { CookieJar, Cookie } from 'tough-cookie';
import { IPHPWindTaskList, IPHPWindTaskRow, IPHPWindTaskRowDoing } from './types';
import { IBluebirdAxiosResponse } from '@bluelovers/axios-extend/lib';
import { _parseTaskInfo } from './util/jquery/_task_info';
import { RequestConfigs } from 'restful-decorator/lib/decorators/config';

/**
 * Created by user on 2020/5/13.
 */

@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
		exclude: {
			query: false,
		}
	},
})
export class PHPWindClient extends AbstractHttpClientWithJSDom
{

	/**
	 * window.verifyhash
	 */
	_verifyhash?: string;

	constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>)
	{
		let [defaults = {}] = argv;

		if (!defaults.baseURL)
		{
			throw new TypeError(`baseURL must set`)
		}

		argv[0] = defaults;

		super(...argv);
	}

	@POST('login.php?submit=login')
	@ReturnValueToJSDOM()
	@FormUrlencoded
	@RequestConfigs({
		cache: {
			maxAge: 0,
		},
	})
	// @ts-ignore
	@methodBuilder(function (this: PHPWindClient, info)
	{
		const inputData = info.argv[0];

		let data = info.requestConfig.data;
		data.cktime = inputData.cookietime || 31536000;
		data.jumpurl = this.$baseURL;
		data.step = 2;

		data.pwuser = inputData.username;
		data.pwpwd = inputData.password;
		data.forward = '';

		return info;
	})
	loginByForm(@ParamMapAuto({
		cookietime: 315360000,
		lgt: 0,
	}) inputData: {
		username: string,
		password: string,
		cookietime?: number,
		lgt?: number | 0 | 1 | 2,
		hideid?: number | 0 | 1,
	}): IBluebird<boolean|string>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		this._updateVerifyHash(jsdom);

		let username = _checkLoginUsername(jsdom.$);

		if (username != null)
		{
			return Bluebird.resolve(username)
		}

		return this.isLogin()
			.then(bool => {

				if (!bool)
				{
					return Promise.reject(bool);
				}

				return bool
			})
			;
	}

	@GET('message.php')
	@ReturnValueToJSDOM()
	@RequestConfigs({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	isLogin(): IBluebird<boolean | string>
	{
		const jsdom = this.$returnValue as IJSDOM;

		this._updateVerifyHash(jsdom);

		let username = _checkLoginUsername(jsdom.$);

		if (username != null)
		{
			return Bluebird.resolve(username)
		}

		return Bluebird.resolve(_checkLoginByJQuery(jsdom.$))
	}

	_getAuthCookies()
	{
		let cr = /_(?:winduser)$/;

		let ret = this._jar()
			.findCookieByKey(cr, this.$baseURL)
			.reduce((a, b) =>
			{

				let _m = cr.exec(b.key);

				// @ts-ignore
				a[_m[1]] = b;

				return a;
			}, {} as Record<'winduser', Cookie>)
		;

		return ret;
	}

	hasCookiesAuth()
	{
		return this._jar()
			.findCookieByKey(/_(?:winduser)$/)
			.length > 0
			;
	}

	_updateVerifyHash(jsdom?: IJSDOM | string)
	{
		if (typeof jsdom === 'string')
		{
			this._verifyhash = jsdom
		}
		else if (jsdom?.window?.verifyhash)
		{
			this._verifyhash = jsdom.window.verifyhash
		}

		return this._verifyhash
	}

	taskList(): IBluebird<IPHPWindTaskList>
	{
		let self = this;
		return this.taskListNew()
			.then(async (taskList) => {
				return {
					...taskList,
					doing: await self.taskListDoing(),
				}
			})
			;
	}

	@GET('plugin.php?H_name-tasks.html')
	@ReturnValueToJSDOM()
	@RequestConfigs({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskListNew(): IBluebird<IPHPWindTaskList>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		const verifyhash = this._updateVerifyHash(jsdom);

		let data: IPHPWindTaskList = {
			disallow: [],
			allow: [],
		};

		$('#main div > table:has(.f_one)')
			.find('.f_one')
			.each((i, elem) =>
			{
				let _tr = $(elem);

				let obj = _parseTaskInfo($, _tr);

				if (!obj)
				{
					return;
				}

				delete obj.task_percent;
				delete obj.task_drawable;

				data[(obj.task_id ? 'allow' : 'disallow')]
					.push(obj)
				;
			})
		;

		return data as null
	}

	@GET('plugin.php?H_name-tasks-actions-newtasks.html')
	@ReturnValueToJSDOM()
	@RequestConfigs({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskListDoing(): IBluebird<NonNullable<IPHPWindTaskList["doing"]>>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		const verifyhash = this._updateVerifyHash(jsdom);

		const taskList = [] as NonNullable<IPHPWindTaskList["doing"]>

		$('#main div > table:has(.f_one)')
			.find('.f_one')
			.each((i, elem) =>
			{
				let _tr = $(elem);

				let obj = _parseTaskInfo($, _tr);

				if (!obj)
				{
					return;
				}

				taskList
					.push(obj)
				;
			})
		;

		return taskList as null
	}

	@GET('plugin.php?H_name=tasks&action=ajax&actions=job&cid={task_id}&nowtime={nowtime}&verify={verify}')
	@RequestConfigs({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskApply(@ParamPath('task_id') task_id: number | string, @ParamMapAuto() extra: {
		nowtime?: string | number,
		verify?: string,
	} = {
		nowtime: Date.now(),
		verify: this._updateVerifyHash(),
	}): IBluebirdAxiosResponse<unknown>
	{
		return
	}

	@GET('plugin.php?H_name=tasks&action=ajax&actions=job2&cid={task_id}&nowtime={nowtime}&verify={verify}')
	@RequestConfigs({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskDraw(@ParamPath('task_id') task_id: number | string, @ParamMapAuto() extra: {
		nowtime?: string | number,
		verify?: string,
	} = {
		nowtime: Date.now(),
		verify: this._updateVerifyHash(),
	}): IBluebirdAxiosResponse<unknown>
	{
		return
	}

	doAutoTaskList(cb?: (eventName: 'taskListNew' | 'taskApply' | 'taskListDoing' | 'taskDraw', data: any) => any)
	{
		return this.taskListNew()
			.tap((ls) => cb?.('taskListNew', ls))
			.then(ls => ls.allow)
			.mapSeries(task => this.taskApply(task.task_id).tap((r) => cb?.('taskApply', r)))
			.then(() => this.taskListDoing())
			.tap((r) => cb?.('taskListDoing', r))
			.mapSeries(task => task.task_drawable && this.taskDraw(task.task_id).tap((r) => cb?.('taskDraw', r)))
			;
	}

}

export default PHPWindClient
