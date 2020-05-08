import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import {
	BaseUrl,
	BodyData,
	CacheRequest,
	CatchError,
	FormUrlencoded,
	GET,
	HandleParamMetadata,
	Headers,
	methodBuilder,
	ParamData,
	ParamMapAuto,
	ParamMapQuery,
	POST,
	PUT,
	RequestConfigs,
	TransformRequest, ParamPath, ParamMapPath,

} from 'restful-decorator/lib/decorators';
import { ITSPickExtra, ITSValueOrArray } from 'ts-type';
import { IBluebird } from 'restful-decorator/lib/index';
import LazyURL from 'lazy-url';
import { defaultsDeep } from 'lodash';
import { _makeAuthorizationValue, EnumAuthorizationType } from 'restful-decorator/lib/decorators/headers';
// @ts-ignore
import { AxiosError } from 'axios';
import { mergeAxiosErrorWithResponseData } from 'restful-decorator/lib/wrap/error';
import Bluebird from 'bluebird';
// @ts-ignore
import deepEql from 'deep-eql';
import { IBluebirdAxiosResponse } from '@bluelovers/axios-extend/lib';
import {
	ISearchSingle,
	ISearchSingleDataRowPlus,
	IMangaData,
	IMangaReadData,
	IMangaListOptions,
	IMangaListRow, IMangaList,
} from './types';
import { parseMangaKey, parseReadUrl } from './site/parse';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
import { IJSDOM } from 'jsdom-extra/lib/pack';
import { arrayBufferToBuffer } from '@bluelovers/array-buffer-to-string';
import { EnumMirrorSites } from './mirror';
import { setValue } from 'dot-values2';

@BaseUrl(EnumMirrorSites.LOVEHEAVEN)
@Headers({
	'Accept': 'application/json',
	Referer: EnumMirrorSites.LOVEHEAVEN,
})
@RequestConfigs({
	responseType: 'json',
})
@CacheRequest({
	cache: {
		maxAge: 15 * 60 * 1000,
		readHeaders: false,
	},
})
/**
 * @link https://lhscan.net/app/manga/controllers/search.single.php?q=%E9%AA%91%E5%A3%AB%E9%AD%94
 */
export class LHScanClient extends AbstractHttpClientWithJSDom
{

	constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>)
	{
		let [defaults = {}] = argv;

		if (defaults.baseURL)
		{
			setValue(defaults, 'headers.Referer', defaults.baseURL);
		}

		argv[0] = defaults;

		super(...argv);
	}

	@GET('app/manga/controllers/search.single.php')
	@methodBuilder()
	_searchSingle(@ParamData('q') keyword: string): IBluebird<ISearchSingle[]>
	{
		return null;
	}

	createURL(url: string)
	{
		return new LazyURL(url, this.$baseURL);
	}

	searchSingle(keyword: string)
	{
		return this._searchSingle(keyword)
			.then(ret =>
			{
				return ret.map(topRow =>
				{
					let data = topRow.data.map(data =>
					{

						let href = data.onclick.replace(/^window.location=['"](.+?)['"]/, '$1');

						href = this.createURL(href).toString();
						let path = this.createURL(href).pathname;

						let id_key = parseMangaKey(path);

						return <ISearchSingleDataRowPlus>{
							...data,
							href,
							path,
							id_key,
						};
					});
					return {
						...topRow,
						data,
					};
				})
			})
	}

	@GET('manga-{id_key}.html')
	@ReturnValueToJSDOM()
	@methodBuilder()
	manga(@ParamPath('id_key') id_key: string)
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		const chapters: IMangaData["chapters"] = [];

		$('#tab-chapper a.chapter')
			.each((idx, elem) =>
			{
				let _this = $(elem);

				let href = _this.prop('href')

				let { id_key, chapter_id } = parseReadUrl(href)

				chapters.push({
					id_key,
					chapter_id,
				})
			})
		;

		const ret: IMangaData = {
			chapters,
		}

		return ret as any as Bluebird<IMangaData>
	}

	@GET('read-{id_key}-chapter-{chapter_id}.html')
	@ReturnValueToJSDOM()
	@methodBuilder()
	read(@ParamMapAuto() opts: {
		id_key: string,
		chapter_id: string | number,
	})
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		const images: string[] = [];

		$('.chapter-content img.chapter-img')
			.each((idx, elem) =>
			{

				let _this = $(elem);
				let src = _this.attr('data-src') || _this.prop('src');

				src = src.replace(/\s+$/g, '');

				images.push(src);
			})
		;

		return {
			images,
		} as IMangaReadData as any as Bluebird<IMangaReadData>
	}

	fetchBuffer(url: string)
	{
		return this.$http.get(url, {
				responseType: 'arraybuffer',
				cache: {
					maxAge: 0,
					ignoreCache: true,
					// @ts-ignore
					excludeFromCache: true,
				},
			})
			.then(response => arrayBufferToBuffer(response.data, 'binary', 'binary'))
			;
	}

	@GET('manga-list.html')
	@ReturnValueToJSDOM()
	@methodBuilder()
	mangaList(@ParamMapAuto<IMangaListOptions>({
		listType: 'pagination',
		sort: 'last_update',
	}) query?: IMangaListOptions)
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		let list = [] as IMangaListRow[];

		$('.container .row.top > .row-list')
			.each((idx, elem) => {
				let _this = $(elem);

				let _a = _this.find('.media-heading a');

				let id = _a.attr('onmouseenter').match(/show\((\d+)\)/)[1];

				let id_key = parseMangaKey(_a.prop('href'))

				let title = _a.text();

				let genre: string[] = [];

				_this.find('a[href*="manga-list-genre-"]')
					.each((idx, elem) => {
						let _this = $(elem);

						genre.push(_this.text());
					})
				;

				_a = _this.find('a[href^="read-"]');

				let last_chapter = parseReadUrl(_a.prop('href'))

				list.push({
					id,
					id_key,
					title,
					last_chapter,
				})
			})
		;

		let page = $('.pagination-wrap .pagination .active').text();
		let page_max = $('.pagination-wrap .pagination li:eq(-2)').text();

		return {
			page,
			page_max,
			query,
			list,
		} as IMangaList as any as Bluebird<IMangaList>
	}

}

export default LHScanClient
