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
	// @ts-ignore
	@ReturnValueToJSDOM()
	@methodBuilder()
	protected _manga(@ParamPath('id_key') id_key: string)
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		let manga_info = $('.manga-info');

		let _breadcrumb = $('.breadcrumb li[itemprop="itemListElement"]:eq(-1)');

		let _a = _breadcrumb.find('a[itemscope][itemid]');
		let title: string;
		let cover: string;

		if (/manga-.+-raw\.html$/.test(_a.attr('itemid')))
		{

			title = _a.find('[itemprop="name"]').text().trim();

			cover = _a.find('[itemprop="image"]').prop('src');

		}

		if (!title?.length)
		{
			throw new RangeError(`manga '${id_key}' not exists`)
		}

		let other_names: string;
		let authors: IMangaData["authors"] = [];
		let tags: IMangaData["tags"] = [];
		let magazine: IMangaData["magazine"] = [];

		manga_info.find('> li')
			.each((index, element) => {

				let _this = $(element);

				let label = _this.find('b:eq(0)').text().trim();
				let body = _this.clone().remove('b:eq(0)');

				if (/Other names/i.test(label))
				{
					other_names = body.text().trim()
						.replace(/^\s*:\s*/, '')
					;
				}
				else if (/Author/i.test(label))
				{
					body.find('small a')
						.each((i, elem) => {

							let link = $(elem).attr('href');

							let name = link.match(/manga-author-(.+)\.html/)?.[1]?.trim?.();

							if (name?.length > 0)
							{
								authors.push(name);
							}

						})
					;
				}
				else if (/GENRE/i.test(label))
				{
					body.find('small a')
						.each((i, elem) => {

							let link = $(elem).attr('href');

							let name = link.match(/manga-list-genre-(.+)\.html/)?.[1]?.trim?.();

							if (name?.length > 0)
							{
								tags.push(name);
							}

						})
					;
				}
				else if (/Magazine/i.test(label))
				{
					body.find('small a')
						.each((i, elem) => {

							let name = $(elem).text().trim();

							if (name?.length > 0)
							{
								magazine.push(name);
							}

						})
					;
				}

			})
		;

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
			id_key,

			title,
			other_names,

			cover,

			authors,
			tags,
			magazine,

			chapters,
		}

		return ret as any as Bluebird<IMangaData>
	}

	manga(id_key: string): Bluebird<IMangaData>
	{
		id_key = id_key
			.replace(/\.html$/, '')
		;

		return this._manga(id_key)
			.catch(RangeError, e => {

				let id_key_new = id_key.replace(/^manga-/, '');

				if (id_key_new !== id_key)
				{
					return this._manga(id_key_new)
				}

				return Promise.reject(e)
			})
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
			id_key: opts.id_key,
			chapter_id: opts.chapter_id.toString(),
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

	@GET('manga-author-{author}.html')
	// @ts-ignore
	@ReturnValueToJSDOM()
	@methodBuilder()
	author(@ParamPath('author') author: string)
	{

	}

	@GET('manga-list-genre-{tag}.html')
	// @ts-ignore
	@ReturnValueToJSDOM()
	@methodBuilder()
	mangaListByGenre(@ParamPath('tag') tag: string)
	{

	}

	@GET('manga-on-going.html')
	// @ts-ignore
	@ReturnValueToJSDOM()
	@methodBuilder()
	mangaListByStatusOnGoing()
	{

	}

	mangaListByGroup(group: string, query?: IMangaListOptions)
	{
		return this.mangaList({
			...query,
			group,
		})
	}

}

export default LHScanClient
