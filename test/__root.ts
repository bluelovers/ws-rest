/**
 * 測試路徑架構 / Test Path Structure
 *
 * test/
 * ├── fixtures/              ← 測試資料夾（唯讀）/ Test data directory (read-only)
 * └── temp/                 ← 臨時檔案（可寫，永遠建立子資料夾）/ Temp files (writable, always create subdirectories)
 *     ├── fake-lib/
 *     └── temp-pkg/
 */
/// <reference types="node" />
import path from 'upath2';
// @ts-ignore
import { __ROOT_CORE as __ROOT } from './__root-core.cjs';

/**
 * 專案根目錄
 * Project root directory
 */
export { __ROOT }

/**
 * 作業系統判斷
 * Operating system detection
 *
 * 用於判斷當前平台是否為 Windows
 * Used to determine if current platform is Windows
 */
export const isWin = process.platform === "win32";

/**
 * 測試資料夾
 * Test data directory
 *
 * 用於存放測試用的靜態資料
 * Used to store static test data
 *
 * @default test
 */
export const __TEST_ROOT = path.join(__ROOT, 'test');

/**
 * 測試資料夾（唯讀）
 * Test data directory (read-only)
 *
 * 用於存放測試用的靜態資料與 fixtures
 * Used to store static test data and fixtures
 *
 * @default test/fixtures
 */
export const __TEST_FIXTURES = path.join(__TEST_ROOT, 'fixtures');

/**
 * 臨時檔案（可寫，永遠建立子資料夾）
 * Temp files (writable, always create subdirectories)
 *
 * test/
 * ├── fixtures/              ← 測試資料夾（唯讀）/ Test data directory (read-only)
 * └── temp/                 ← 臨時檔案（可寫，永遠建立子資料夾）/ Temp files (writable, always create subdirectories)
 *     ├── fake-lib/
 *     └── temp-pkg/
 *
 * @default test/temp
 */
export const __TEST_TEMP = path.join(__TEST_ROOT, 'temp');