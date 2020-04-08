import SyosetuClient from './index';
import { ParamData } from 'restful-decorator/lib/decorators/body';
import { EnumSyosetuApiParamOrderBy, EnumSyosetuApiRawNovelNocgenre } from './util/const';
import { ITSOverwrite } from 'ts-type/lib/type/record';

export type ISyosetuApiRaw001<T> = [
	{
		allcount: number;
	},
	...T[],
]

export interface ISyosetuApiParam
{
	/**
	 * int(1～5)
	 *
	 * gzip圧縮してgzipファイルとして返します。
	 * gzip圧縮レベルを1～5で指定できます。
	 * 転送量上限を減らすためにも推奨
	 */
	gzip?: 1 | 2 | 3 | 4 | 5,
	/**
	 * 出力形式をyamlまたはjsonまたはphpを指定。
	 * 未指定時はYAMLになる。outパラメータの詳細
	 */
	out?: 'yaml' | 'json' | 'php' | 'atom' | 'jsonp',
	/**
	 * 出力する項目を個別に指定できます。
	 * 未指定時は全項目出力されます。
	 * 転送量軽減のため、このパラメータの使用が推奨されます。
	 * 複数項目を出力する場合は-で区切ってください。
	 * 詳しくは出力の項目をご覧ください。
	 */
	of?: string,
	/**
	 * int(1～500)
	 *
	 * 最大出力数を指定できます。最低1、最高500です。
	 * 半角数字で指定してください。
	 * 指定しない場合は20件になります。
	 */
	lim?: number | 1 | 20 | 500,

	/**
	 * int(1～2000)
	 *
	 * 表示開始位置の指定です。
	 * 半角数字で指定してください。
	 * たとえば全部で10作品あるとして、3作品目以降の小説情報を取得したい場合は3と指定してください。
	 */
	st?: number,

	order?: string | EnumSyosetuApiParamOrderBy,

	libtype?: number | 2,
}

export type IBool = 0 | 1;

export interface ISyosetuApiNcodeRawCore
{
	title: string;
	/**
	 * "N5624CV"
	 */
	ncode: string;
	writer: string;
	story: string;

	gensaku: string;
	/**
	 * "R15 残酷な描写あり ガールズラブ 異世界転生 ハーレム ファンタジー 年上の女性 チート おねしょた ほのぼの コメディ TS 男主人公"
	 */
	keyword: string;
	/**
	 * "2015-08-22 15:33:32"
	 */
	general_firstup: string;
	/**
	 * "2020-03-21 15:13:00"
	 */
	general_lastup: string;
	novel_type: number | 1;
	end: number | 1;
	general_all_no: number;
	length: number;
	time: number;
	isstop: IBool;
	isbl: IBool;
	isgl: IBool;
	iszankoku: IBool;
	istensei: IBool;
	istenni: IBool;
	/**
	 * 1はケータイのみ、
	 * 2はPCのみ、
	 * 3はPCとケータイで投稿された作品です。
	 * 対象は投稿と次話投稿時のみで、どの端末で執筆されたかを表すものではありません。
	 */
	pc_or_k: 1 | 2 | 3;
	global_point: number;
	daily_point: number;
	weekly_point: number;
	monthly_point: number;
	quarter_point: number;
	yearly_point: number;
	fav_novel_cnt: number;
	review_cnt: number;
	impression_cnt: number;
	all_point: number;
	all_hyoka_cnt: number;
	sasie_cnt: number;
	kaiwaritu: number;
	/**
	 * 2020-03-22 09:33:20
	 */
	novelupdated_at: string;
	/**
	 * 2020-04-08 05:07:05
	 */
	updated_at: string;
}

export type ISyosetuApiNcodeRawAll = ISyosetuApiNcodeRaw | ISyosetuApiNcode18Raw

export interface ISyosetuApiNcode18Raw extends ISyosetuApiNcodeRawCore
{
	nocgenre: 1 | 2 | 3 | 4 | EnumSyosetuApiRawNovelNocgenre;

	userid?: number;
	biggenre?: number | 2;
	genre?: number;
	isr15?: IBool;
}

export interface ISyosetuApiNcodeRaw extends ISyosetuApiNcodeRawCore
{
	nocgenre?: 1 | 2 | 3 | 4 | EnumSyosetuApiRawNovelNocgenre;

	userid: number;
	biggenre: number | 2;
	genre: number;
	isr15: IBool;
}

export type ISyosetuApiNcode<T extends ISyosetuApiNcodeRawCore> = ITSOverwrite<T, {
	/**
	 * microseconds
	 */
	general_firstup: number;
	/**
	 * microseconds
	 */
	general_lastup: number;
	/**
	 * microseconds
	 */
	novelupdated_at: number;
	/**
	 * microseconds
	 */
	updated_at: number;

	keyword: string[];
}>
