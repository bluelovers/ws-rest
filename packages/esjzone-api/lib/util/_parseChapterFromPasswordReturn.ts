import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import { AxiosResponse } from 'axios';
import { IESJzoneChapterFromPasswordReturnRaw } from '../types';
import { IJSDOM } from 'restful-decorator-plugin-jsdom';

export function _handleChapterFromPasswordReturnRaw(json: IESJzoneChapterFromPasswordReturnRaw)
{
	if (json.html?.length)
	{
		json.html = '<meta charset="utf-8"><div class="container"><div class="forum-content">' + json.html + '</div></div>';
	}

	return json
}

export function _parseSiteLinkChapterFromPasswordReturn<T extends AbstractHttpClientWithJSDom>(api: T, json: IESJzoneChapterFromPasswordReturnRaw, response?: AxiosResponse<any>)
{
	let html = _handleChapterFromPasswordReturnRaw(json).html

	let jsdom: IJSDOM;

	if (html?.length)
	{
		jsdom = api._responseDataToJSDOM(html, response ??= api.$response);
	}

	return {
		jsdom,
		response,
	}
}

