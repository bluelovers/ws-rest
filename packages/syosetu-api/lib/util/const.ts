export enum EnumSyosetuApiURL
{
	novel = 'novelapi/api/',
	novel18 = 'novel18api/api/',
}

export enum EnumSyosetuApiParamOrderBy
{
	/**
	 * 新着更新順
	 */
		'new' = 'new',
	/**
	 * R18ブックマーク数の多い順
	 **/
	favnovelcnt = 'favnovelcnt',
	/**
	 * レビュー数の多い順
	 **/
	reviewcnt = 'reviewcnt',
	/**
	 * 総合ポイントの高い順
	 **/
	hyoka = 'hyoka',
	/**
	 * 評価者数の多い順
	 **/
	hyokacnt = 'hyokacnt',
	/**
	 * 小説本文の文字数が多い順
	 **/
	lengthdesc = 'lengthdesc',
	/**
	 * 日間ポイントの高い順
	 **/
	dailypoint = 'dailypoint',
	/**
	 * 週間ポイントの高い順
	 **/
	weeklypoint = 'weeklypoint',
	/**
	 * 月間ポイントの高い順
	 **/
	monthlypoint = 'monthlypoint',
	/**
	 * 四半期ポイントの高い順
	 **/
	quarterpoint = 'quarterpoint',
	/**
	 * 年間ポイントの高い順
	 **/
	yearlypoint = 'yearlypoint',
	/**
	 * 小説本文の文字数が少ない順
	 **/
	lengthasc = 'lengthasc',
	/**
	 * 更新が古い順
	 **/
	old = 'old',
}

/**
 * 掲載サイトを指定できます。ハイフン(-)記号で区切れば複数の掲載サイトを一括抽出できます。
 */
export enum EnumSyosetuApiRawNovelNocgenre
{
	/**
	 * ノクターンノベルズ(男性向け)
	 */
		'b' = 1,
	/**
	 * ムーンライトノベルズ(女性向け)
	 */
		'g',
	/**
	 * ムーンライトノベルズ(BL)
	 */
		'bl',
	/**
	 * ミッドナイトノベルズ(大人向け)
	 */
	r18,
}

/**
 * ジャンル
 */
export enum EnumSyosetuApiRawNovelGenre
{
	/**
	 * 異世界〔恋愛〕
	 **/
	Genre101 = 101,
	/**
	 * 現実世界〔恋愛〕
	 **/
	Genre102 = 102,
	/**
	 * ハイファンタジー〔ファンタジー〕
	 **/
	Genre201 = 201,
	/**
	 * ローファンタジー〔ファンタジー〕
	 **/
	Genre202 = 202,
	/**
	 * 純文学〔文芸〕
	 **/
	Genre301 = 301,
	/**
	 * ヒューマンドラマ〔文芸〕
	 **/
	Genre302 = 302,
	/**
	 * 歴史〔文芸〕
	 **/
	Genre303 = 303,
	/**
	 * 推理〔文芸〕
	 **/
	Genre304 = 304,
	/**
	 * ホラー〔文芸〕
	 **/
	Genre305 = 305,
	/**
	 * アクション〔文芸〕
	 **/
	Genre306 = 306,
	/**
	 * コメディー〔文芸〕
	 **/
	Genre307 = 307,
	/**
	 * VRゲーム〔SF〕
	 **/
	Genre401 = 401,
	/**
	 * 宇宙〔SF〕
	 **/
	Genre402 = 402,
	/**
	 * 空想科学〔SF〕
	 **/
	Genre403 = 403,
	/**
	 * パニック〔SF〕
	 **/
	Genre404 = 404,
	/**
	 * 童話〔その他〕
	 **/
	Genre9901 = 9901,
	/**
	 * 詩〔その他〕
	 **/
	Genre9902 = 9902,
	/**
	 * エッセイ〔その他〕
	 **/
	Genre9903 = 9903,
	/**
	 * リプレイ〔その他〕
	 **/
	Genre9904 = 9904,
	/**
	 * その他〔その他〕
	 **/
	Genre9999 = 9999,
	/**
	 * ノンジャンル〔ノンジャンル〕
	 */
	Genre9801 = 9801,
}
