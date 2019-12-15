import { AbstractHttpClient } from 'restful-decorator/lib';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import {
	BaseUrl,
	BodyData,
	CacheRequest,
	FormUrlencoded,
	GET,
	Headers,
	methodBuilder,
	ParamData,
	ParamMapData,
	ParamPath,
	POST,
	RequestConfigs,
	TransformResponse,
	CatchError, ParamQuery, HandleParamMetadata,
	ParamMapAuto,
} from 'restful-decorator/lib/decorators';
import { ICookiesValue, LazyCookieJar } from 'lazy-cookies';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { array_unique } from 'array-hyper-unique';
import consoleDebug from 'restful-decorator/lib/util/debug';
import toughCookie, { CookieJar } from 'tough-cookie';
import {
	fromURL,
	IFromUrlOptions,
	IJSDOM,
	createJSDOM,
	IConstructorOptions as IJSDOMConstructorOptions,
} from 'jsdom-extra';
import { combineURLs } from 'restful-decorator/lib/fix/axios';
import { paramMetadataRequestConfig } from 'restful-decorator/lib/wrap/abstract';
import { trimUnsafe } from './util';
import moment from 'moment';
import {
	IParametersSlice, IDiscuzForumMini, IDiscuzForum, IDzParamForumdisplay,
} from './types';
import { IUnpackedPromiseLikeReturnType } from '@bluelovers/axios-extend/lib';
import uniqBy from 'lodash/uniqBy';
import tryMinifyHTML from 'restful-decorator-plugin-jsdom/lib/html';
import { getConfig, setConfig } from 'restful-decorator/lib/decorators/config/util';
import merge from 'restful-decorator/lib/util/merge';

@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
	},
})
export class DiscuzClient extends AbstractHttpClientWithJSDom
{

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

	protected _constructor()
	{
		return super._constructor();
	}

	@GET('forum.php?mod=forumdisplay&fid={fid}')
	@methodBuilder()
	forum(@ParamMapAuto(<Partial<IDzParamForumdisplay>>{
		filter: 'lastpost',
		orderby: 'lastpost',
	}) argv: IDzParamForumdisplay): IBluebird<IDiscuzForum>
	{
		const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);

		const { $ } = jsdom;

		let fid = argv.fid | 0;

		let forum_name = $(`#ct h1 a[href$="forum.php?mod=forumdisplay&fid=${fid}"]`).text();

		let subforum_area = $(`#wp #ct #subforum_${argv.fid}.bm_c`);

		let subforums: IDiscuzForumMini[] = [];

		subforum_area
			.find('.fl_g')
			.each((i, elem) =>
			{
				let _this = $(elem);

				let _a = _this
					.find('a[href*="forumdisplay"]:eq(0)')
				;

				let _url = new URL(_a.prop('href'));

				let forum_name: string;

				if (_a.find('> img[src*="forum"][alt]').length)
				{
					forum_name = _a.find('> img[src*="forum"][alt]').prop('alt');
				}
				else
				{
					forum_name = _a.text();
				}

				let fid = (_url.searchParams.get('fid') as any) | 0;

				subforums.push({
					fid,
					forum_name,
				})
			})
		;

		return <IDiscuzForum>{
			fid,
			forum_name,
			subforums
		} as any
	}

	/**
	 * @deprecated
	 * @todo
	 */
	isLogin(): IBluebird<boolean>
	{
		return Bluebird.resolve(false)
	}

}

export default DiscuzClient
