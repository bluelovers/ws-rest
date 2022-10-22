import { EnumSyosetuApiParamOrderBy, EnumSyosetuApiRawNovelNocgenre, EnumSyosetuApiRawNovelGenre } from './util/const';
import { ITSOverwrite } from 'ts-type/lib/type/record';
export type ISyosetuApiRaw001<T> = [
    {
        allcount: number;
    },
    ...T[]
];
export type ISyosetuApiParamOf = "-" | "t" | "n" | "u" | "w" | "s" | "bg" | "g" | "k" | "gf" | "gl" | "nt" | "e" | "ga" | "l" | "ti" | "i" | "ir" | "ibl" | "igl" | "izk" | "its" | "iti" | "p" | "gp" | "f" | "r" | "a" | "ah" | "sa" | "ka" | "nu" | "ua";
export interface ISyosetuApiParams {
    /**
     * int(1～5)
     *
     * gzip圧縮してgzipファイルとして返します。
     * gzip圧縮レベルを1～5で指定できます。
     * 転送量上限を減らすためにも推奨
     */
    gzip?: 1 | 2 | 3 | 4 | 5;
    /**
     * 出力形式をyamlまたはjsonまたはphpを指定。
     * 未指定時はYAMLになる。outパラメータの詳細
     */
    out?: 'yaml' | 'json' | 'php' | 'atom' | 'jsonp';
    /**
     * 出力する項目を個別に指定できます。
     * 未指定時は全項目出力されます。
     * 転送量軽減のため、このパラメータの使用が推奨されます。
     * 複数項目を出力する場合は-で区切ってください。
     * 詳しくは出力の項目をご覧ください。
     */
    of?: string | ISyosetuApiParamOf;
    /**
     * int(1～500)
     *
     * 最大出力数を指定できます。最低1、最高500です。
     * 半角数字で指定してください。
     * 指定しない場合は20件になります。
     */
    lim?: number | 1 | 20 | 500;
    /**
     * int(1～2000)
     *
     * 表示開始位置の指定です。
     * 半角数字で指定してください。
     * たとえば全部で10作品あるとして、3作品目以降の小説情報を取得したい場合は3と指定してください。
     */
    st?: number;
    order?: string | EnumSyosetuApiParamOrderBy;
    libtype?: number | 2;
}
export type IBool = 0 | 1;
export interface ISyosetuApiNcodeRawCore {
    /**
     * 小説名
     */
    title: string;
    /**
     * "N5624CV"
     */
    ncode: string;
    /**
     * 作者名
     */
    writer: string;
    /**
     * 小説のあらすじ
     */
    story: string;
    /**
     * 現在未使用項目(常に空文字が返ります)
     */
    gensaku: string | '';
    /**
     * "R15 残酷な描写あり ガールズラブ 異世界転生 ハーレム ファンタジー 年上の女性 チート おねしょた ほのぼの コメディ TS 男主人公"
     */
    keyword: string;
    /**
     * 初回掲載日
     * "2015-08-22 15:33:32"
     */
    general_firstup: string;
    /**
     * 最終掲載日
     * "2020-03-21 15:13:00"
     */
    general_lastup: string;
    /**
     * 連載の場合は1、短編の場合は2
     */
    novel_type: number | 1 | 2;
    /**
     * 短編小説と完結済小説は0となっています。連載中は1です。
     */
    end: number | 1;
    /**
     * 	全掲載部分数です。短編の場合は1です。
     */
    general_all_no: number;
    /**
     * 小説文字数です。スペースや改行は文字数としてカウントしません。
     */
    length: number;
    /**
     * 読了時間(分単位)です。読了時間は小説文字数÷500を切り上げした数値です。
     */
    time: number;
    /**
     * 長期連載停止中なら1、それ以外は0です。
     */
    isstop: IBool;
    /**
     * 登録必須キーワードに「ボーイズラブ」が含まれる場合は1、それ以外は0です。
     */
    isbl: IBool;
    /**
     * 登録必須キーワードに「ガールズラブ」が含まれる場合は1、それ以外は0です。
     */
    isgl: IBool;
    /**
     * 登録必須キーワードに「残酷な描写あり」が含まれる場合は1、それ以外は0です。
     */
    iszankoku: IBool;
    /**
     * 登録必須キーワードに「異世界転生」が含まれる場合は1、それ以外は0です。
     */
    istensei: IBool;
    /**
     * 登録必須キーワードに「異世界転移」が含まれる場合は1、それ以外は0です。
     */
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
    /**
     * 感想数
     */
    impression_cnt: number;
    all_point: number;
    /**
     * 評価者数
     */
    all_hyoka_cnt: number;
    /**
     * 挿絵の数
     */
    sasie_cnt: number;
    /**
     * 会話率
     */
    kaiwaritu: number;
    /**
     * 小説の更新日時
     * 2020-03-22 09:33:20
     */
    novelupdated_at: string;
    /**
     * 2020-04-08 05:07:05
     * 最終更新日時
     */
    updated_at: string;
}
export interface ISyosetuApiNcodeCore extends ISyosetuApiNcodeRawCore {
    novel18: boolean;
    url: string;
}
export type ISyosetuApiNcodeRawAll = ISyosetuApiNcodeRaw | ISyosetuApiNcode18Raw;
export interface ISyosetuApiNcode18Raw extends ISyosetuApiNcodeRawCore {
    /**
     * 掲載サイトを指定できます。ハイフン(-)記号で区切れば複数の掲載サイトを一括抽出できます。
     */
    nocgenre: 1 | 2 | 3 | 4 | EnumSyosetuApiRawNovelNocgenre;
    userid?: undefined;
    biggenre?: undefined;
    genre?: undefined;
    isr15?: undefined;
}
export interface ISyosetuApiNcodeRaw extends ISyosetuApiNcodeRawCore {
    nocgenre?: undefined;
    userid: number;
    /**
     * 大ジャンル指定
     */
    biggenre: number | 2;
    /**
     * ジャンル
     */
    genre: number | EnumSyosetuApiRawNovelGenre;
    /**
     * 登録必須キーワードに「R15」が含まれる場合は1、それ以外は0です。
     */
    isr15: IBool;
}
export type ISyosetuApiNcode<T extends ISyosetuApiNcodeRawCore = ISyosetuApiNcodeRawAll> = ITSOverwrite<T, {
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
    novel18: T extends ISyosetuApiNcode18Raw ? true : T extends ISyosetuApiNcodeRaw ? false : boolean;
    url: string;
}>;
