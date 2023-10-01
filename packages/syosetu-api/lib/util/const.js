"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumSyosetuApiRawNovelGenre = exports.EnumSyosetuApiRawNovelNocgenre = exports.EnumSyosetuApiParamOrderBy = exports.EnumSyosetuApiURL = void 0;
var EnumSyosetuApiURL;
(function (EnumSyosetuApiURL) {
    EnumSyosetuApiURL["novel"] = "novelapi/api/";
    EnumSyosetuApiURL["novel18"] = "novel18api/api/";
})(EnumSyosetuApiURL || (exports.EnumSyosetuApiURL = EnumSyosetuApiURL = {}));
var EnumSyosetuApiParamOrderBy;
(function (EnumSyosetuApiParamOrderBy) {
    /**
     * 新着更新順
     */
    EnumSyosetuApiParamOrderBy["new"] = "new";
    /**
     * R18ブックマーク数の多い順
     **/
    EnumSyosetuApiParamOrderBy["favnovelcnt"] = "favnovelcnt";
    /**
     * レビュー数の多い順
     **/
    EnumSyosetuApiParamOrderBy["reviewcnt"] = "reviewcnt";
    /**
     * 総合ポイントの高い順
     **/
    EnumSyosetuApiParamOrderBy["hyoka"] = "hyoka";
    /**
     * 評価者数の多い順
     **/
    EnumSyosetuApiParamOrderBy["hyokacnt"] = "hyokacnt";
    /**
     * 小説本文の文字数が多い順
     **/
    EnumSyosetuApiParamOrderBy["lengthdesc"] = "lengthdesc";
    /**
     * 日間ポイントの高い順
     **/
    EnumSyosetuApiParamOrderBy["dailypoint"] = "dailypoint";
    /**
     * 週間ポイントの高い順
     **/
    EnumSyosetuApiParamOrderBy["weeklypoint"] = "weeklypoint";
    /**
     * 月間ポイントの高い順
     **/
    EnumSyosetuApiParamOrderBy["monthlypoint"] = "monthlypoint";
    /**
     * 四半期ポイントの高い順
     **/
    EnumSyosetuApiParamOrderBy["quarterpoint"] = "quarterpoint";
    /**
     * 年間ポイントの高い順
     **/
    EnumSyosetuApiParamOrderBy["yearlypoint"] = "yearlypoint";
    /**
     * 小説本文の文字数が少ない順
     **/
    EnumSyosetuApiParamOrderBy["lengthasc"] = "lengthasc";
    /**
     * 更新が古い順
     **/
    EnumSyosetuApiParamOrderBy["old"] = "old";
})(EnumSyosetuApiParamOrderBy || (exports.EnumSyosetuApiParamOrderBy = EnumSyosetuApiParamOrderBy = {}));
/**
 * 掲載サイトを指定できます。ハイフン(-)記号で区切れば複数の掲載サイトを一括抽出できます。
 */
var EnumSyosetuApiRawNovelNocgenre;
(function (EnumSyosetuApiRawNovelNocgenre) {
    /**
     * ノクターンノベルズ(男性向け)
     */
    EnumSyosetuApiRawNovelNocgenre[EnumSyosetuApiRawNovelNocgenre["b"] = 1] = "b";
    /**
     * ムーンライトノベルズ(女性向け)
     */
    EnumSyosetuApiRawNovelNocgenre[EnumSyosetuApiRawNovelNocgenre["g"] = 2] = "g";
    /**
     * ムーンライトノベルズ(BL)
     */
    EnumSyosetuApiRawNovelNocgenre[EnumSyosetuApiRawNovelNocgenre["bl"] = 3] = "bl";
    /**
     * ミッドナイトノベルズ(大人向け)
     */
    EnumSyosetuApiRawNovelNocgenre[EnumSyosetuApiRawNovelNocgenre["r18"] = 4] = "r18";
})(EnumSyosetuApiRawNovelNocgenre || (exports.EnumSyosetuApiRawNovelNocgenre = EnumSyosetuApiRawNovelNocgenre = {}));
/**
 * ジャンル
 */
var EnumSyosetuApiRawNovelGenre;
(function (EnumSyosetuApiRawNovelGenre) {
    /**
     * 異世界〔恋愛〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre101"] = 101] = "Genre101";
    /**
     * 現実世界〔恋愛〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre102"] = 102] = "Genre102";
    /**
     * ハイファンタジー〔ファンタジー〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre201"] = 201] = "Genre201";
    /**
     * ローファンタジー〔ファンタジー〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre202"] = 202] = "Genre202";
    /**
     * 純文学〔文芸〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre301"] = 301] = "Genre301";
    /**
     * ヒューマンドラマ〔文芸〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre302"] = 302] = "Genre302";
    /**
     * 歴史〔文芸〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre303"] = 303] = "Genre303";
    /**
     * 推理〔文芸〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre304"] = 304] = "Genre304";
    /**
     * ホラー〔文芸〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre305"] = 305] = "Genre305";
    /**
     * アクション〔文芸〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre306"] = 306] = "Genre306";
    /**
     * コメディー〔文芸〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre307"] = 307] = "Genre307";
    /**
     * VRゲーム〔SF〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre401"] = 401] = "Genre401";
    /**
     * 宇宙〔SF〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre402"] = 402] = "Genre402";
    /**
     * 空想科学〔SF〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre403"] = 403] = "Genre403";
    /**
     * パニック〔SF〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre404"] = 404] = "Genre404";
    /**
     * 童話〔その他〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre9901"] = 9901] = "Genre9901";
    /**
     * 詩〔その他〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre9902"] = 9902] = "Genre9902";
    /**
     * エッセイ〔その他〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre9903"] = 9903] = "Genre9903";
    /**
     * リプレイ〔その他〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre9904"] = 9904] = "Genre9904";
    /**
     * その他〔その他〕
     **/
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre9999"] = 9999] = "Genre9999";
    /**
     * ノンジャンル〔ノンジャンル〕
     */
    EnumSyosetuApiRawNovelGenre[EnumSyosetuApiRawNovelGenre["Genre9801"] = 9801] = "Genre9801";
})(EnumSyosetuApiRawNovelGenre || (exports.EnumSyosetuApiRawNovelGenre = EnumSyosetuApiRawNovelGenre = {}));
//# sourceMappingURL=const.js.map