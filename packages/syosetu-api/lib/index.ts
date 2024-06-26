import AbstractHttpClientWithJSDom, { IJSDOM } from 'restful-decorator-plugin-jsdom/lib';
import { BaseUrl } from 'restful-decorator/lib/decorators/http';
import { Headers } from 'restful-decorator/lib/decorators/headers';
import { CacheRequest } from 'restful-decorator/lib/decorators/config/cache';
import Bluebird from 'bluebird';
import { GET } from 'restful-decorator/lib/decorators/method';
import { methodBuilder } from 'restful-decorator/lib/wrap/abstract';
import { RequestConfigs } from 'restful-decorator/lib/decorators/config';
import { ParamPath, ParamData, BodyData, ParamMapAuto } from 'restful-decorator/lib/decorators/body';
import { EnumSyosetuApiURL } from './util/const';
import { buildVersion } from 'dmzj-api/lib/util';
import {
	ISyosetuApiRaw001,
	ISyosetuApiNcodeRaw,
	ISyosetuApiParams,
	ISyosetuApiNcode,
	ISyosetuApiNcodeRawAll, ISyosetuApiNcode18Raw,
} from './types';
import { moment } from '@node-novel/site-cache-util/lib/moment';
import { parseDateStringToMoment } from './util/parseDate';
import { buildLink } from './util/parseUrl';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';

/**
 * @see https://syosetu.com/
 *
 * @see https://dev.syosetu.com/man/rankapi/
 * @see https://dev.syosetu.com/man/api/
 *
 * r18
 * @see https://dev.syosetu.com/xman/api/
 *
 *
 * @see https://github.com/59naga/naroujs
 * @see https://github.com/ErgoFriend/yomoujs
 */
@BaseUrl('https://api.syosetu.com/')
@Headers({
	Referer: 'https://syosetu.com/',
})
@CacheRequest({
	cache: {
		maxAge: 12 * 60 * 60 * 1000,
	},
})
export class SyosetuClient extends AbstractHttpClientWithJSDom
{

	protected _constructor()
	{
		this._setCookieSync({
			key: 'over18',
			value: 'yes',
			expires: 3600 * 24 * 360,
		});
	}

	_syosetuApi<T>(apiPath: string, params: ISyosetuApiParams)
	{
		return this.$http.get<T>(apiPath, {
			params,
		})
	}

	/**
	 * ncode api raw json
	 *
	 * https://api.syosetu.com/novelapi/api/
	 * https://api.syosetu.com/novel18api/api/
	 */
	ncodeInfoRaw(ncode: string, novel18: true): Promise<ISyosetuApiNcode18Raw>
	ncodeInfoRaw(ncode: string, novel18: false): Promise<ISyosetuApiNcodeRaw>
	ncodeInfoRaw(ncode: string, novel18?: boolean): Promise<ISyosetuApiNcodeRawAll>
	@GET(EnumSyosetuApiURL.novel)
	@RequestConfigs({
		responseType: 'json',
	})
	@BodyData<ISyosetuApiParams>({
		libtype: 2,
		out: 'json',
		lim: 1,
	})
	// @ts-ignore
	@methodBuilder(function (info) {

		const [, novel18] = info.argv;

		if (novel18)
		{
			info.requestConfig.url = EnumSyosetuApiURL.novel18;
		}

		return info;
	}, {
		autoRequest: true,
	})
	ncodeInfoRaw(@ParamData('ncode') ncode: string, novel18?: boolean): Promise<ISyosetuApiNcodeRawAll>
	{
		const $returnValue = this.$returnValue as ISyosetuApiRaw001<ISyosetuApiNcodeRawAll>;

		if ($returnValue[0].allcount === 0 || $returnValue[1] === void 0)
		{
			return Promise.reject(new RangeError(`Invalid ncode: ${ncode}, novel18: ${!!novel18}`))
		}

		// @ts-ignore
		return this.$returnValue[1] as any
	}

	/**
	 * ncode api json
	 *
	 * https://api.syosetu.com/novelapi/api/
	 * https://api.syosetu.com/novel18api/api/
	 */
	ncodeInfo(ncode: string, novel18: true): Promise<ISyosetuApiNcode<ISyosetuApiNcode18Raw>>
	ncodeInfo(ncode: string, novel18: false): Promise<ISyosetuApiNcode<ISyosetuApiNcodeRaw>>
	ncodeInfo(ncode: string, novel18?: boolean): Promise<ISyosetuApiNcode<ISyosetuApiNcodeRawAll>>
	ncodeInfo(ncode: string, novel18?: boolean)
	{
		novel18 = !!novel18;

		return this.ncodeInfoRaw(ncode, novel18)
			.then(data => {
				return <ISyosetuApiNcode<typeof data>>{
					...data,

					general_firstup: parseDateStringToMoment(data.general_firstup).valueOf(),
					general_lastup: parseDateStringToMoment(data.general_lastup).valueOf(),
					novelupdated_at: parseDateStringToMoment(data.novelupdated_at).valueOf(),
					updated_at: parseDateStringToMoment(data.updated_at).valueOf(),

					keyword: data.keyword.split(/\s+/),

					novel18,
					url: `https://${novel18 ? 'novel18' : 'ncode'}.syosetu.com/${data.ncode.toLowerCase()}/`,
				}
			})
		;
	}

	@ReturnValueToJSDOM()
	@methodBuilder(function (info) {

		const data = info.argv[0];

		let href = buildLink(data);

		info.requestConfig.url = href;

		return info;
	}, {
		autoRequest: true,
	})
	_getWebNovelRaw(argv: {
		novel_r18?: boolean,
		novel_id: string,
		chapter_id: string | number,
		protocol?: string,
	})
	{
		return Promise.resolve(this.$returnValue as IJSDOM)
	}

	getChapter(argv: {
		novel_r18?: boolean,
		novel_id: string,
		chapter_id: string | number,
		protocol?: string,
	}, options: {
		rawHtml?: boolean,
		cb?(data: {
			i: number,
			$elem: JQuery<HTMLElement>,
			$content: JQuery<HTMLElement>,
			src: string,
			imgs: string[],
		}): void,
	} = {})
	{
		return this._getWebNovelRaw(argv)
	}

}

export default SyosetuClient
