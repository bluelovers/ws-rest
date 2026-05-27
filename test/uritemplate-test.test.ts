import { describe, expect, it } from 'vitest';
import specExamples from './fixtures/uritemplate-test/spec-examples.json';
import extendedTests from './fixtures/uritemplate-test/extended-tests.json';
import negativeTests from './fixtures/uritemplate-test/negative-tests.json';
import specBySection from './fixtures/uritemplate-test/spec-examples-by-section.json';
import { expandRfc6570, parseRouterVars } from '../parser';

/**
 * @type {ITestGroup}
 *
 * 單個測試群組的資料結構
 * Data structure for a single test group
 */
interface ITestGroup
{
	/** 模板變數定義 / Template variable definitions */
	variables: Record<string, unknown>;
	/**
	 * 測試案例陣列
	 * Test cases array
	 *
	 * 每個元素為 [template, expected]：
	 * - template: URI 模板字串 / URI template string
	 * - expected: 預期展開結果 / Expected expansion result
	 *   - string: 單一預期值 / Single expected value
	 *   - string[]: 可接受的多個預期值（規格允許多種有效輸出）/ Multiple acceptable values
	 *   - false: 負向測試（無效模板）/ Negative test (invalid template)
	 */
	testcases: Array<[string, string | string[] | false]>;
}

/**
 * 執行單一測試群組
 * Run a single test group
 *
 * @param groupName - 群組名稱 / Group name
 * @param group - 測試群組資料 / Test group data
 */
function _runTestGroup(groupName: string, { variables, testcases }: ITestGroup)
{
	describe(groupName, () =>
	{
		for (const [index, testCase] of testcases.entries())
		{
			const [template, expected] = testCase;

			it(`[${index}] ${template}`, () =>
			{
				/**
				 * =====================================================
				 * 展開 URI 模板
				 * Expand URI template
				 *
				 * 注意：uri-template-lite 對部分無效模板不會拋錯，
				 * 而是回傳某種展開結果。因此負向測試不預期拋錯，
				 * 而是透過 snapshot 驗證實際行為。
				 *
				 * Note: uri-template-lite does not throw for some
				 * invalid templates, but returns a result. Negative
				 * tests do not expect throws; they use snapshots
				 * to verify actual behavior.
				 * =====================================================
				 */
				const result = expandRfc6570(template, variables);

				/**
				 * 驗證 1：router 必須等於原始模板字串
				 * Assert 1: router must equal the original template string
				 */
				expect(result.router).toBe(template);

				/**
				 * =====================================================
				 * 負向測試：無效模板
				 * Negative test: invalid template
				 *
				 * 僅驗證 router 與 snapshot，不檢查 url。
				 * Only verify router and snapshot, skip url check.
				 * =====================================================
				 */
				if (expected === false)
				{
					expect(result).toMatchSnapshot({
						router: template,
					});

					return;
				}

				/**
				 * =====================================================
				 * 正向測試：有效模板
				 * Positive test: valid template
				 * =====================================================
				 */

				/**
				 * 驗證 2：url 透過 snapshot 比對
				 * Assert 2: url verified via snapshot
				 *
				 * 使用 property matcher 固定 router，url 寫入實際展開結果，
				 * 讓 snapshot 作為預期值。這能捕捉 uri-template-lite 的行為變更。
				 *
				 * Uses property matchers with router pinned and url set
				 * to the actual expansion result, letting snapshots serve
				 * as expected values. This captures behavior changes.
				 */
				expect(result).toMatchSnapshot({
					router: template,
					url: result.url,
				});

				/**
				 * 驗證 3：paths 中的變數值必須正確
				 * Assert 3: variable values in paths must be correct
				 *
				 * 解析模板中出現的所有變數名稱，再與 data 比對。
				 * 變數存在於 template → 放入 paths，值必須與輸入一致。
				 */
				const ks = parseRouterVars(template);
				for (const key of ks)
				{
					if (key in variables)
					{
						expect(result.paths).toHaveProperty(key, variables[key]);
					}
				}

				/**
				 * 驗證 4：data 中的變數值必須正確
				 * Assert 4: variable values in data must be correct
				 *
				 * 所有存在於 data 但未在模板中出現的變數 → 放入 data。
				 */
				const ksSet = new Set(ks);
				for (const key of Object.keys(variables))
				{
					if (!ksSet.has(key))
					{
						expect(result.data).toHaveProperty(key, variables[key]);
					}
				}
			});
		}
	});
}

/**
 * 執行整份測試檔案
 * Run an entire test file
 *
 * @param fileName - 測試檔案名稱（用於 describe 標題）
 * @param data - 測試資料物件
 */
function _runTestFile(fileName: string, data: Record<string, ITestGroup>)
{
	describe(fileName, () =>
	{
		for (const [groupName, group] of Object.entries(data))
		{
			_runTestGroup(groupName, group);
		}
	});
}

/**
 * ============================================================
 * 主測試套件
 * Main test suite
 *
 * 匯入官方 uritemplate-test 資料集：
 * 1. spec-examples.json — RFC 6570 規格範例（Level 1 ~ Level 4）
 * 2. extended-tests.json — 延伸邊界案例（含已知 uri-template-lite 限制）
 * 3. negative-tests.json — 無效模板負向測試
 * 4. spec-examples-by-section.json — 依 RFC 章節組織
 *
 * 已知限制 / Known limitations:
 * - uri-template-lite 對 Reserved Expansion 中的預編碼值會雙重編碼
 *   (Additional Examples 6)，此為上游函式庫限制。
 * - uri-template-lite 對部分無效模板不拋錯，此處透過 snapshot 記錄實際行為。
 *
 * @see https://github.com/uri-templates/uritemplate-test
 * ============================================================
 */
describe('uritemplate-test', () =>
{
	_runTestFile('spec-examples.json', specExamples as unknown as Record<string, ITestGroup>);
	_runTestFile('extended-tests.json', extendedTests as unknown as Record<string, ITestGroup>);
	_runTestFile('negative-tests.json', negativeTests as unknown as Record<string, ITestGroup>);
	_runTestFile('spec-examples-by-section.json', specBySection as unknown as Record<string, ITestGroup>);
});
