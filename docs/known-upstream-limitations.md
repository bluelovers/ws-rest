# uri-template-lite 已知上游限制
# Known Upstream Limitations

## 概述

本文件記錄 `expandRfc6570` 與 `matchRfc6570` 底層使用的第三方函式庫 [uri-template-lite](https://github.com/litejs/uri-template-lite) 的已知行為差異與限制。

This document records known behavioral differences and limitations of the third-party library [uri-template-lite](https://github.com/litejs/uri-template-lite) used by `expandRfc6570` and `matchRfc6570`.

---

## Expand-side Limitations（展開層限制）

### 1. Reserved Expansion 雙重編碼
### 1. Reserved Expansion Double-encoding

**症狀：** 預先百分比編碼的值在 `{+var}` 或 `{#var}` 模式下被雙重編碼。

**Symptom:** Pre-percent-encoded values are double-encoded in `{+var}` or `{#var}` modes.

| 模板 | 變數值 | 預期 (RFC 6570) | `uri-template-lite` 結果 |
|------|--------|-----------------|--------------------------|
| `{+id}` | `admin%2F` | `admin%2F` | `admin%252F` |
| `{#id}` | `admin%2F` | `#admin%2F` | `#admin%252F` |
| `{?id}` | `admin%2F` | `?id=admin%2F` | `?id=admin%252F` |
| `{;id}` | `admin%2F` | `;id=admin%2F` | `;id=admin%252F` |

**根因：** `uri-template-lite` 在展開時對所有非保留字元編碼，包括變數值中已存在的 `%`，將 `%` 編碼為 `%25`。

**Root cause:** `uri-template-lite` encodes all non-reserved characters during expansion, including `%` signs already present in variable values, encoding `%` as `%25`.

**受影響測試：** `extended-tests.json`「Additional Examples 6: Reserved Expansion」中 6 個包含預編碼值的案例。

**Affected tests:** 6 test cases with pre-encoded values in `extended-tests.json` "Additional Examples 6: Reserved Expansion".

---

### 2. Boolean `true` 視為字串 `"true"`
### 2. Boolean `true` Treated as String `"true"`

**症狀：** `{?var}` 搭配 `{ var: true }` 展開為 `?var=true`，而非 RFC 規範的無值格式。

**Symptom:** `{?var}` with `{ var: true }` expands to `?var=true` instead of the RFC-specified empty-value format.

```ts
expandRfc6570('{?var}', { var: true });
// 實際：'?var=true'
// RFC 6570 規範對 boolean 無明確定義，部分實作預期 '?var'（無值）
```

**根因：** `uri-template-lite` 未對 JavaScript 的 `boolean` 型別做特殊處理，直接呼叫 `String(true)` → `"true"`。

**Root cause:** `uri-template-lite` does not special-case JavaScript's `boolean` type, calling `String(true)` → `"true"`.

---

### 3. 無效模板不拋錯
### 3. Invalid Templates Don't Throw

**症狀：** 許多 RFC 6570 定義的無效模板不會拋出錯誤，而是回傳某種展開結果。

**Symptom:** Many RFC 6570 invalid templates don't throw errors and instead produce some expansion output.

| 無效模板 | 違規原因 | `uri-template-lite` 行為 |
|----------|---------|--------------------------|
| `{/id*` | 缺少閉合 `}` | 不回傳錯誤，視為純文字 |
| `{var:prefix}` | `:N` 後非數字 | 不回傳錯誤 |
| `{hello:2*}` | 衝突的 prefix + explode | 不回傳錯誤 |
| `{!hello}` | 無效運算子 `!` | 不回傳錯誤 |
| `{with space}` | 變數名含空白 | 不回傳錯誤 |
| `{?empty=default,var}` | 預設值語法 | 不回傳錯誤 |

**根因：** `uri-template-lite` 對模板的語法驗證較 RFC 規範寬鬆。

**Root cause:** `uri-template-lite` has looser template syntax validation compared to the RFC spec.

---

### 4. `:N` Prefix-length 對陣列不生效
### 4. `:N` Prefix-length Does Not Work on Arrays

**症狀：** `{list:2}` 搭配 `{ list: ['a', 'b', 'c'] }` 應截斷陣列至前 2 個元素，但 `uri-template-lite` 無法正確處理。

**Symptom:** `{list:2}` with `{ list: ['a', 'b', 'c'] }` should truncate the array to the first 2 elements, but `uri-template-lite` does not handle this correctly.

```ts
// RFC 6570 預期：'a,b'
// uri-template-lite 實際行為不明確 / undefined behavior
```

---

### 5. `.keys*` Assoc Explode 配對分隔符
### 5. `.keys*` Assoc Explode Pair Separator

**症狀：** Label 運算子下 assoc explode 使用 `,` 而非 `.` 作為 kv 配對分隔符。

**Symptom:** Assoc explode under the Label operator uses `,` instead of `.` as the kv pair separator.

```ts
expandRfc6570('{.keys*}', { keys: { k1: 'v1', k2: 'v2' } });
// RFC 6570 預期：'.k1=v1.k2=v2'
// uri-template-lite 實際：'.k1=v1,k2=v2'
```

---

## Match-side Limitations（匹配層限制）

### 6. Explode List\* Match 回傳錯誤陣列
### 6. Explode List\* Match Returns Wrong Array

**症狀：** 對 explode 修飾詞 `*` 的陣列進行 match 時，多個值被合併為單一陣列元素。

**Symptom:** When matching an exploded list (`*` modifier), multiple values are merged into a single array element.

#### Query Explode `{?list*}` 匹配 `?list=a&list=b`

```ts
matchRfc6570('{?list*}', '?list=a&list=b');
// 實際 match 結果：{ list: ["a&list=b"] }   ← 單一元素
// RFC 預期：          { list: ["a", "b"] }     ← 兩個獨立元素
```

`uri-template-lite` 將整個 `a&list=b` 當成一個字串塞進陣列第一個元素。

`uri-template-lite` treats the entire `a&list=b` as a single string in the first array element.

#### Path Explode `{/list*}` 匹配 `/a/b`

```ts
matchRfc6570('{/list*}', '/a/b');
// 實際 match 結果：{ list: ["a/b"] }   ← 單一元素
// RFC 預期：          { list: ["a", "b"] }  ← 兩個獨立元素
```

**根因：** `uri-template-lite` 的 match 正則對 explode 模式的捕捉邏輯未正確拆分多個值。

**Root cause:** `uri-template-lite`'s match regex for explode patterns does not correctly split multiple values.

**實際影響：** 若將陣列 explode 展開成 URL，再 match 回來時 explode 過的陣列無法正確還原。建議避開 explode round-trip，改用逗號多變數 `{?list}` → `?list=a,b`（單值字串）。

**Practical impact:** If you expand an array with explode into a URL and then match it back, the exploded array cannot be correctly restored. Avoid explode round-trips; use comma multi-variable `{?list}` → `?list=a,b` instead (single string value).

---

### 7. Query 多變數 Round-trip 不對稱性
### 7. Query Multi-variable Round-trip Asymmetry

**症狀：** `{?page,limit}` 這類逗號多變數 query 模板中，expand 允許省略部分變數，但 match 要求所有變數都必須存在。

**Symptom:** In comma-separated multi-variable query templates like `{?page,limit}`, expand omits missing variables, but match requires all variables to be present.

```ts
// 展開：page=1，limit 省略 → 成功
const expanded = expandRfc6570('/api{/version}/users{?page,limit}', { version: 'v1', page: 1 });
// expanded.url → '/api/v1/users?page=1'

// 匹配：缺少 limit → 失敗
const matched = matchRfc6570('/api{/version}/users{?page,limit}', '/api/v1/users?page=1');
// matched → undefined
```

**根因：** `uri-template-lite` 的 `Template.match` 對 query 多變數要求所有變數都必須出現在 URI 中，但 `Template.expand` 允許省略未提供的變數。

**Root cause:** `uri-template-lite`'s `Template.match` requires all variables in a multi-variable query to appear in the URI, but `Template.expand` allows omitting variables that weren't provided.

**實際影響：** 僅在 query 多變數且省略部分參數時才觸發。若所有變數都有提供值，round-trip 正常：

**Practical impact:** Only triggers with multi-variable query templates when some parameters are omitted. If all variables have values, round-trip works normally:

```ts
expandRfc6570('/api{/version}/users{?page,limit}', { version: 'v1', page: 1, limit: 10 });
// → '/api/v1/users?page=1&limit=10'

matchRfc6570('/api{/version}/users{?page,limit}', '/api/v1/users?page=1&limit=10');
// → { version: 'v1', page: '1', limit: '10' } ✅ round-trip 正常
```

---

## 限制追蹤摘要

| # | 限制 | 影響範圍 | 嚴重程度 | 測試檔案 |
|---|------|---------|---------|---------|
| 1 | Reserved Expansion 雙重編碼 | expand | 中 | `expand-syntax.test.ts` |
| 2 | boolean `true` 視為字串 | expand | 低 | `expand-syntax.test.ts` |
| 3 | 無效模板不拋錯 | expand | 低 | `expand-syntax.test.ts` |
| 4 | `:N` 對陣列不生效 | expand | 低 | `expand-syntax.test.ts` |
| 5 | `.keys*` 配對分隔符 | expand | 低 | `expand-syntax.test.ts` |
| 6 | Explode list\* match 回傳錯誤陣列 | match | 中 | `match-syntax.test.ts` |
| 7 | Query 多變數 round-trip 不對稱 | match | 低 | `match-syntax.test.ts` |

## 測試驗證策略

所有已知限制皆透過 **snapshot testing** 記錄實際行為：

- 當 `uri-template-lite` 行為與 RFC 6570 規範不一致時，不強制斷言通過或失敗
- 使用 `toMatchSnapshot()` 記錄實際輸出
- 如果上游修復了某個限制，snapshot 會自動變更，測試將失敗並提示開發者審查
- 開發者審查後可更新 snapshot（`vitest -u`）來確認新的正確行為

All known limitations are recorded via **snapshot testing**:

- When `uri-template-lite` behavior deviates from RFC 6570, we don't force pass/fail assertions
- Actual output is recorded with `toMatchSnapshot()`
- If upstream fixes a limitation, the snapshot will change, tests will fail, alerting the developer
- After review, the developer can update snapshots (`vitest -u`) to confirm the new correct behavior
