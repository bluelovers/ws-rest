export enum EnumSyosetuApiURL
{
	novel = 'https://api.syosetu.com/novelapi/api/',
	novel18 = 'https://api.syosetu.com/novel18api/api/',
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
