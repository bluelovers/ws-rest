/**
 * 路由轉換工具模組
 * Router transformation utility module
 *
 * 提供在 Router 語法與 RFC 6570 URI Template 語法之間的轉換功能
 * Provides conversion between Router syntax and RFC 6570 URI Template syntax
 */
/**
 * RFC 6570 轉 Router 的選項介面
 * RFC 6570 to Router conversion options interface
 *
 * @property ignoreUnSupport - 若為 true，遇到不支援的語法時保留原內容不轉換，而非拋出錯誤 / If true, keep original content as-is when encountering unsupported syntax instead of throwing
 */
export interface IRfc6570ToRouterOptions {
    ignoreUnSupport?: boolean;
}
/**
 * 將路由語法轉換為 RFC 6570 相容格式
 * Convert router syntax to RFC 6570 compatible format
 *
 * 將 :varname 替換為 {+varname} 以符合 RFC 6570 標準
 * Replaces :varname with {+varname} to make it RFC 6570 compatible
 *
 * @param url - 路由格式的 URL 字串 / Router format URL string
 * @returns RFC 6570 格式的 URI 模板字串 / RFC 6570 format URI template string
 *
 * @see https://github.com/octokit/endpoint.js/blob/master/src/parse.ts
 * @see https://tools.ietf.org/html/rfc6570
 */
export declare function routerToRfc6570(url: string): string;
/**
 * 將 RFC 6570 格式轉換回路由語法
 * Convert RFC 6570 format back to router syntax
 *
 * 將 {varname} 替換回 :varname 格式
 * Replaces {varname} back to :varname format
 *
 * @param url - RFC 6570 格式的 URI 模板字串 / RFC 6570 format URI template string
 * @param opts - 轉換選項 / Conversion options
 * @param opts.ignoreUnSupport - 若為 true，遇到不支援的語法時保留原內容不轉換，而非拋出錯誤 / If true, keep original content as-is when encountering unsupported syntax instead of throwing
 * @returns 路由格式的 URL 字串 / Router format URL string
 *
 * @throws TypeError 當包含不支援的規則且 opts.ignoreUnSupport 不為 true 時拋出錯誤 / Throws TypeError when unsupported rules are present and opts.ignoreUnSupport is not true
 */
export declare function rfc6570ToRouter(url: string, opts?: IRfc6570ToRouterOptions): string;
/**
 * 檢查變數名稱是否包含不支援的規則
 * Check if variable name contains unsupported rules
 *
 * 驗證變數名稱是否符合基本路由規則
 * Validates whether variable name conforms to basic router rules
 *
 * @param w - 變數名稱 / Variable name
 * @param throwError - 是否在不支援時拋出錯誤 / Whether to throw error when unsupported
 * @returns 當 throwError 為 false 時，返回是否不支援 / Returns whether unsupported when throwError is false
 *
 * @throws TypeError 當 throwError 為 true 且變數不支援時拋出錯誤 / Throws TypeError when throwError is true and variable is unsupported
 */
export declare function _notSupport(w: string, throwError?: boolean): boolean;
export default routerToRfc6570;
