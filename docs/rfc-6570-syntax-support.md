# RFC 6570 URI Template 語法支援度參照

> **套件：** `router-uri-convert`
>
> 本文件詳細列出 `router-uri-convert` 對 [RFC 6570 URI Template](https://tools.ietf.org/html/rfc6570) 的語法支援程度，包括展開（expansion）、轉換回 Router URI 語法、以及已知限制。

---

## 1. 總覽：兩個子系統

`router-uri-convert` 實質上包含**兩個獨立層級**的 RFC 6570 支援：

| 子系統 | 函式 | 引擎 | 支援範圍 |
|--------|------|------|---------|
| **展開層** | `expandRfc6570()` | `uri-template-lite` (第三方) | **完整 RFC 6570** — Level 1 ~ Level 4 |
| **轉換層** | `rfc6570ToRouter()` | 自有的 `_isSupportedRouterVar` | **真子集** — 僅單一純量變數 `{var}` / `{+var}` |

**展開層 (`expandRfc6570`)** 委託 `uri-template-lite` 進行實際展開，因此以該函式庫的支援度為準。
**轉換層 (`rfc6570ToRouter`)** 將 RFC 6570 模板轉回 Router URI 格式（如 `:varname`），由於 Router 本身語法的限制，僅能處理最簡單的變數表達式。

> Router URI 語法（源自 Express.js / Octokit）僅支援具名路徑參數 `:varname`，沒有運算子、多變數、修飾詞等概念。因此 `rfc6570ToRouter` 的轉換範圍是 RFC 6570 的真子集。

---

## 2. 運算子支援度矩陣

RFC 6570 定義了 8 種運算子（含預設無運算子），以及無運算子的基本字串展開：

| 運算子 | 名稱 | 範例 | `expandRfc6570`<br>(展開) | `rfc6570ToRouter`<br>(轉換回 `:var`) | `parseRouterVars`<br>(變數提取) |
|--------|------|------|:---:|:---:|:---:|
| *(none)* | Simple String | `{var}` | ✅ | ✅ → `:var` | ✅ |
| `+` | Reserved | `{+var}` | ✅ | ✅ → `:var` | ✅ |
| `#` | Fragment | `{#var}` | ✅ | ❌ TypeError | ✅ |
| `.` | Label | `{.var}` | ✅ | ❌ TypeError | ✅ |
| `/` | Path Segment | `{/var}` | ✅ | ❌ TypeError | ✅ |
| `;` | Path-Style (Matrix) | `{;var}` | ✅ | ❌ TypeError | ✅ |
| `?` | Form-Style Query | `{?var}` | ✅ | ❌ TypeError | ✅ |
| `&` | Form-Style Continuation | `{&var}` | ✅ | ❌ TypeError | ✅ |

### 2.1 無運算子 (Simple String) — `{var}`

最基本的變數展開，RFC 6570 Level 1。

| 變數值型態 | 展開結果 | 範例 |
|-----------|---------|------|
| 純量字串 | URL 編碼後的值 | `{var}` + `var="Hello World!"` → `Hello%20World%21` |
| 陣列 | 逗號連接 | `{list}` + `list=["a","b"]` → `a,b` |
| 關聯陣列 | 逗號連接的 key,value 序列 | `{keys}` → `key1,val1,key2,val2` |
| 不存在/undefined | 空字串 | `{missing}` → `` |

### 2.2 Reserved Expansion — `{+var}`

保留字元 (`/`, `:`, `?`, `#`, `[`, `]`, `@`, `!`, `$`, `&`, `'`, `(`, `)`, `*`, `+`, `,`, `;`, `=`) 不會被百分比編碼。

| 變數值型態 | 與無運算子的差異 |
|-----------|----------------|
| 純量字串 | 保留字元不編碼：`{+var}` + `var="/foo/bar"` → `/foo/bar`（而 `{var}` → `%2Ffoo%2Fbar`） |
| 陣列 | 與無運算子相同，逗號連接 |
| 關聯陣列 | 保留字元不編碼（半形逗號在值中保持原樣） |

### 2.3 Fragment — `{#var}`

產生 URI fragment，開頭添加 `#`。

### 2.4 Label — `{.var}`

以 `.` 前綴連接。

### 2.5 Path Segment — `{/var}`

以 `/` 前綴連接，陣列/關聯陣列 explode 時 `{/list*}` 產生 `/a/b/c`。

### 2.6 Matrix — `{;var}`

以 `;` 前綴，產生 `;name=value` 格式。

### 2.7 Query — `{?var}`

以 `?` 前綴，產生 `?name=value` 格式。

### 2.8 Continuation — `{&var}`

以 `&` 前綴，產生 `&name=value` 格式。

---

## 3. 修飾詞支援度

| 修飾詞 | 說明 | `expandRfc6570` | `rfc6570ToRouter` | `parseRouterVars` |
|--------|------|:---:|:---:|:---:|
| `*` (Explode) | 展開變數，陣列元素分離成獨立分段 | ✅ | ❌ | ✅ 正確移除 `*` 提取變數名 |
| `:N` (Prefix Length) | 截斷字串/陣列至 N 字元/元素 | ✅ (經 uri-template-lite) | ❌ 正則排除（含 `:`） | ✅ 正確移除 `:N` 提取變數名 |
| `*` + `:N` 同時 | 不合法的 RFC 6570 組合 | ❌（依實作而定） | ❌ | ❌（但 `parseRouterVars` 仍會提取變數名） |

### 3.1 Explode 修飾詞 — `{var*}`

將陣列或關聯陣列的元素分離，產生獨立分段而非逗號連接：

```typescript
// 陣列 explode
expandRfc6570('{/list*}', { list: ['red', 'green', 'blue'] });
// url: '/red/green/blue'
// （對比 {/list} → '/red,green,blue'）

// 關聯陣列 explode  
expandRfc6570('{?keys*}', { keys: { key1: 'val1', key2: 'val2' } });
// url: '?key1=val1&key2=val2'
// （對比 {?keys} → '?keys=key1,val1,key2,val2'）
```

### 3.2 Prefix Length 修飾詞 — `{var:N}`

將純量字串或陣列截斷至指定長度：

```typescript
expandRfc6570('{var:3}', { var: 'value' });
// url: 'val'

expandRfc6570('{+path:6}/here', { path: '/foo/bar' });
// url: '/foo/b/here'  (注意：保留 `+` 語意，`/` 不被編碼)
```

> **注意**：由於 `rfc6570ToRouter` 的正則 `/\{([^{}:"']+)\}/g` **排除了含 `:` 的內容**，包含 Prefix Length 修飾詞的模板（如 `{var:3}`）永遠不會被匹配或轉換，總是保留原樣。這不是刻意設計，而是正則的副作用。

---

## 4. 變數語法支援度

### 4.1 變數名稱規則

| 語法 | 範例 | `expandRfc6570` | `rfc6570ToRouter` | `parseRouterVars` |
|------|------|:---:|:---:|:---:|
| 純字母 | `{var}` | ✅ | ✅ | ✅ |
| 數字 | `{42}` | ✅ | ✅ | ✅ |
| 底線 | `{var_name}` | ✅ | ✅ | ✅ |
| 混合 | `{default-graph-uri}` | ✅ | ❌（含連字號 `-`，非 `\w`） | ✅ |
| 波浪號前綴 | `{~thing}` | ✅ | ❌ | ✅ |
| 百分比編碼 | `{Some%20Thing}` | ✅ | ❌ | ✅ |
| 點號 | `{last.name}` | ✅ | ❌（含 `.`，非 `\w`） | ✅ |
| 空格 | `{with space}` | ❌（RFC 不允許空白） | ❌ | ❌ |

### 4.2 多變數（逗號分隔）

```typescript
expandRfc6570('{x,y}', { x: '1024', y: '768' });
// url: '1024,768'

expandRfc6570('{?x,y}', { x: '1024', y: '768' });
// url: '?x=1024&y=768'
```

| 語法 | 範例 | `expandRfc6570` | `rfc6570ToRouter` | `parseRouterVars` |
|------|------|:---:|:---:|:---:|
| 無運算子多變數 | `{x,y}` | ✅ | ❌ | ✅ 提取 `["x","y"]` |
| 運算子 + 多變數 | `{?x,y}` | ✅ | ❌ | ✅ 提取 `["x","y"]` |
| 多變數 + explode | `{?keys*}` | ✅ | ❌ | ✅ 提取 `["keys"]` |

### 4.3 變數值型態

| 值型態 | `expandRfc6570` | 範例輸出 |
|--------|:---:|---------|
| 字串 | ✅ | `{var}` → `value` |
| 數字 | ✅ | `{number}` → `6` |
| 布林 | ✅ | `{flag}` → `true` |
| 陣列 | ✅ | `{list}` → `a,b,c` |
| 關聯陣列 (物件) | ✅ | `{keys}` → `key1,val1,key2,val2` |
| 空字串 | ✅ | `{empty}` → `` |
| 空陣列 `[]` | ✅ | `{/empty_list}` → `` |
| 空物件 `{}` | ✅ | `{?empty_assoc}` → `` |
| `null` / `undefined` | ✅（視為不存在） | `{missing}` → `` |

---

## 5. `parseRouterVars` 變數提取邏輯

`parseRouterVars` 使用正則 `/\{([#&+.\/;?]?)((?:[-\w%.]+(\*|:\d+)?,?)+)\}/g` 從模板中提取變數名稱。

### 5.1 正則解構

```
\{              — 開頭大括號
  (             — 捕獲組1: 運算子（可選）
    [#&+.\/;?]  — 任一字元運算子
  )?            — 可選
  (             — 捕獲組2: 變數字串
    (?:         — 非捕獲組
      [-\w%.]+  — 變數名稱（允許字母、數字、底線、連字號、百分號、點號）
      (\*|:\d+)?— 可選修飾詞（* explode 或 :N 前綴長度）
      ,?        — 可選逗號
    )+          — 至少一個變數
  )
\}              — 結尾大括號
```

### 5.2 提取行為

| 模板 | 提取結果 | 說明 |
|------|---------|------|
| `{var}` | `["var"]` | 基本變數 |
| `{+var}` | `["var"]` | `+` 運算子被忽略 |
| `{x,y}` | `["x", "y"]` | 逗號分割 |
| `{?x,y}` | `["x", "y"]` | 運算子被忽略 |
| `{var:3}` | `["var"]` | `:N` 修飾詞被移除 |
| `{keys*}` | `["keys"]` | `*` 修飾詞被移除 |
| `{/list*}` | `["list"]` | 運算子 + 修飾詞都被移除 |
| `{+path:6}` | `["path"]` | 全部移除 |
| `{var:3,other:5}` | `["var", "other"]` | 多變數 + 多修飾詞 |
| `/api/{+user}/{?query}` | `["user", "query"]` | 跨表達式提取 |

### 5.3 `paths` vs `data` 分離邏輯

`expandRfc6570` 使用 `parseRouterVars` 的結果決定參數歸屬：

```
模板: /api/{+user}/{?query,number}
資料: { user: 'foo', query: 'mycelium', number: 3, extra: 'x' }

parseRouterVars 結果: ['user']  ← user 出現在模板中
                                  ← query 和 number 在 {?...} 中不被 parseRouterVars 提取（見下方重要備註）

paths: { user: 'foo' }           ← 在模板中出現
data:  { query: 'mycelium',      ← 不在模板中出現
         number: 3,
         extra: 'x' }
```

> **⚠️ 重要備註**：`parseRouterVars` 的正則會提取 **所有出現在模板大括號中的變數名稱**，包括運算子後的變數。例如 `{?query,number}` 會提取 `["query", "number"]`。因此 `query` 和 `number` 實際上也屬於 `paths`，而非 `data`。
>
> 目前的實作中，所有出現在模板中的變數都會被歸入 `paths`，只有未出現在模板中的變數進入 `data`。這是預期的行為。

---

## 6. `rfc6570ToRouter` 轉換邏輯

### 6.1 匹配流程

```
輸入: RFC 6570 模板字串
  │
  ▼
正則: /\{([^{}:"']+)\}/g
  │
  ├── 不匹配（含 : " ' ）→ 保留原樣
  │    範例: {var:3} → {var:3}（含 :，跳過匹配）
  │
  └── 匹配 → 進入 _isSupportedRouterVar 檢查
        │
        ├── 支援: 移除 + 運算子，替換為 :varname
        │    範例: {+user} → :user, {var} → :var
        │
        └── 不支援:
              │
              ├── opts.ignoreUnSupport === true → 保留原樣
              │    範例: {?query} → {?query}
              │
              └── opts.ignoreUnSupport 為 falsy → 拋出 TypeError
```

### 6.2 `_isSupportedRouterVar(w: string): boolean`

```typescript
function _isSupportedRouterVar(w: string): boolean
{
    const stripped = w.replace(/^\+/, '');
    return /^\w+$/.test(stripped);
}
```

僅接受 `+` 開頭（可選）、其餘為 `\w+`（字母、數字、底線）的純量變數。

### 6.3 支援/不支援對照表

| 輸入 | `_isSupportedRouterVar` | 轉換結果 | 說明 |
|------|:---:|---------|------|
| `+user` | ✅ → `user` 符合 `\w+` | `:user` | 標準 round-trip |
| `user` | ✅ → `user` 符合 `\w+` | `:user` | 不含 `+` 也 OK |
| `42` | ✅ → `42` 符合 `\w+` | `:42` | 數字變數名 |
| `var_name` | ✅ → `var_name` 符合 `\w+` | `:var_name` | 底線 OK |
| `?query` | ❌ → `?` 非 `\w` | `ignoreUnSupport` 決定 | 運算子 |
| `x,y` | ❌ → `,` 非 `\w` | `ignoreUnSupport` 決定 | 多變數 |
| `list*` | ❌ → `*` 非 `\w` | `ignoreUnSupport` 決定 | explode |
| `path:6` | ❌ → 正則跳過（含 `:`），不進此函式 | 保留原樣 `{path:6}` | prefix-length |
| `+path:6` | ❌ → 正則跳過（含 `:`） | 保留原樣 `{+path:6}` | prefix-length |
| `default-graph-uri` | ❌ → `-` 非 `\w` | `ignoreUnSupport` 決定 | 連字號 |

---

## 7. `_notSupport` 輔助函式

> 此函式為輔助/檢查用途，不受 `rfc6570ToRouter` 內部邏輯影響。

```typescript
function _notSupport(w: string, throwError?: boolean): boolean | void
```

### 7.1 判定邏輯

```typescript
/^\+?[^\w]+$/.test(w)
```

檢查變數內容是否為「可選的 `+` 後接全部非單字字元」。僅對**純符號**的變數名稱返回 `true`。

### 7.2 行為對照表

| 輸入 | `_notSupport` | 說明 |
|------|:---:|------|
| `?` | `true` | 純符號，不支援 |
| `+` | `true` | 純符號，不支援 |
| `?query` | `false` | 含有 `query` 字元，不觸發此檢查 |
| `x,y` | `false` | 含有字母，不觸發此檢查 |
| `list*` | `false` | 含有字母，不觸發此檢查 |
| `+user` | `false` | 含有字母，不觸發此檢查 |

> **注意**：`_notSupport` 僅捕獲「極端情況」——變數名稱完全沒有單字字元。它與 `_isSupportedRouterVar` 的檢查範圍不同（後者要求**全部**都是單字字元）。實際上，`rfc6570ToRouter` 使用 `_isSupportedRouterVar` 進行更嚴格的判定。

---

## 8. `ignoreUnSupport` 選項行為對照

```typescript
interface IRfc6570ToRouterOptions
{
    ignoreUnSupport?: boolean;
}
```

### 8.1 行為矩陣

| `opts` | `ignoreUnSupport` 實際值 | 支援語法(`{+var}`) | 不支援語法(`{?query}`) | Prefix-length(`{var:3}`) |
|--------|:---:|:---:|:---:|:---:|
| `undefined` (預設) | `undefined` (falsy) | ✅ 正常轉換 | ❌ 拋錯 | ⚠️ 保留原樣 |
| `null` | `null` (falsy) | ✅ 正常轉換 | ❌ 拋錯 | ⚠️ 保留原樣 |
| `{}` | `undefined` (falsy) | ✅ 正常轉換 | ❌ 拋錯 | ⚠️ 保留原樣 |
| `{ ignoreUnSupport: false }` | `false` (falsy) | ✅ 正常轉換 | ❌ 拋錯 | ⚠️ 保留原樣 |
| `{ ignoreUnSupport: true }` | `true` (truthy) | ✅ 正常轉換 | ✅ 保留原樣 | ⚠️ 保留原樣 |
| `{ ignoreUnSupport: 1 }` | `1` (truthy) | ✅ 正常轉換 | ✅ 保留原樣 | ⚠️ 保留原樣 |
| `{ ignoreUnSupport: undefined }` | `undefined` (falsy) | ✅ 正常轉換 | ❌ 拋錯 | ⚠️ 保留原樣 |
| `{ ignoreUnSupport: 0 }` | `0` (falsy) | ✅ 正常轉換 | ❌ 拋錯 | ⚠️ 保留原樣 |

> ⚠️ Prefix-length（含 `:` 的模板）的「保留原樣」行為是正則跳過的結果，與 `ignoreUnSupport` 無關。

### 8.2 `ignoreUnSupport = true` 時的 Round-trip

當使用 `ignoreUnSupport = true` 時，混合 URL 中的支援語法被轉換，不支援語法保留原樣，仍可通過 routerToRfc6570 完整 round-trip：

```typescript
const url = '/api/{+user}/{?query,number}';
const router = rfc6570ToRouter(url, { ignoreUnSupport: true });
// → '/api/:user/{?query,number}'

const roundtrip = routerToRfc6570(router);
// → '/api/{+user}/{?query,number}'（等於原始 url）
```

---

## 9. Round-trip 矩陣

測試 Round-trip 是否成立：`url === routerToRfc6570(rfc6570ToRouter(url))`

| 語法 | Round-trip | 說明 |
|------|:---:|------|
| `{+varname}` | ✅ | 完整 round-trip，唯一原生支援格式 |
| `{varname}` | ✅（正規化為 `{+varname}`） | 不含 `+` 在轉回時自動補回 |
| 其他 `{...}`（運算子、多變數、修飾詞） | ⚠️ | 取決於 `ignoreUnSupport` |
| 含 `:` 的 `{...}` | ⚠️ 始終保留 | 正則跳過，不經任何處理 |

```typescript
// Round-trip 成立
rfc6570ToRouter('/api/{+user}') → '/api/:user'
routerToRfc6570('/api/:user')   → '/api/{+user}'

// Round-trip 正規化（不含 + → 補回 +）
rfc6570ToRouter('/api/{user}')   → '/api/:user'
routerToRfc6570('/api/:user')    → '/api/{+user}'
```

---

## 10. 已知限制

### 10.1 Reserved Expansion 雙重編碼

`uri-template-lite` 在處理**已預先百分比編碼的值**時，會在 Reserved Expansion (`{+var}`) 模式下雙重編碼。

| 模板 | 變數值 | 預期結果 (RFC 6570) | `uri-template-lite` 結果 | 說明 |
|------|--------|:---:|:---:|------|
| `{+id}` | `admin%2F` | `admin%2F` | `admin%252F` | `%` 被額外編碼為 `%25` |
| `{#id}` | `admin%2F` | `#admin%2F` | `#admin%252F` | 同上 |
| `{+list}` | `["red%25", "%2Fgreen"]` | `red%25,%2Fgreen,...` | `red%2525,%252Fgreen,...` | 陣列元素中的 `%` 被雙重編碼 |
| `{+keys}` | `{key1: "val1%2F"}` | `key1,val1%2F,...` | `key1,val1%252F,...` | 關聯陣列中的 `%` 被雙重編碼 |

> **根因**：`uri-template-lite` 在展開時，對變數值中的 `%` 字元進行編碼，而非將其視為已編碼序列的一部分。這在處理已含百分比編碼的資料時會導致不正確的雙重編碼。

**受影響的測試案例**（來自 `extended-tests.json "Additional Examples 6: Reserved Expansion"`）：共 6 個包含預編碼值的保留展開測試，`uri-template-lite` 的輸出與 RFC 6570 規範不符。

### 10.2 無效模板不拋錯

`uri-template-lite` 對許多 RFC 6570 定義的**無效模板**不會拋出錯誤，而是回傳某種展開結果。

| 無效模板 | 違規原因 | `uri-template-lite` 行為 |
|---------|---------|----------------------|
| `{/id*` | 缺少關閉 `}` | 回傳結果 | 
| `/id*}` | 缺少開啟 `{` | 非模板，直接回傳 |
| `{/?id}` | 雙層運算子 | 回傳結果 |
| `{var:prefix}` | Prefix 不是數字 | 回傳結果 |
| `{hello:2*}` | Prefix + Explode 衝突 | 回傳結果 |
| `{??hello}` | 雙層 `?` 運算子 | 回傳結果 |
| `{!hello}` | 不合法運算子 `!` | 回傳結果 |
| `{with space}` | 變數名含空白 | 回傳結果 |
| `{=path}` | 不合法運算子 `=` | 回傳結果 |
| `{$var}` | 不合法運算子 `$` | 回傳結果 |
| `{\|var*}` | 不合法運算子 `\|` | 回傳結果 |
| `{*keys?}` | 運算子位置錯誤 | 回傳結果 |
| `{?empty=default,var}` | 預設值語法（非 RFC 6570 標準）| 回傳結果 |
| `{var}{-prefix\|/-/\|var}` | 過濾器語法（非標準）| 回傳結果 |
| `{?empty\|foo=none}` | 預設值語法（非標準）| 回傳結果 |
| `{+keys:1}` | Prefix 在保留模式下 | 回傳結果 |
| `{;keys:1*}` | Matrix + Prefix + Explode | 回傳結果 |
| `{-join\|&\|var,list}` | 非標準函式 | 回傳結果 |
| `{~thing}` | 雖然 URI 常見但 RFC 未定義 `~` 作為合法變數字元 | ❓ 注意：此測試歸類於負向測試，但部分實作接受此語法 |

所有 29 個負向測試案例皆因 `uri-template-lite` 的寬容處理而「不拋錯」，這在 snapshot 測試中被記錄為實際行為，而非判定為測試失敗。

### 10.3 `parseRouterVars` 正則限制

`expandRe` 正則 `/\{([#&+.\/;?]?)((?:[-\w%.]+(\*|:\d+)?,?)+)\}/g` 的限制：

1. **不驗證語法合法性**：即使是非 RFC 6570 標準的運算子或組合，也可能被正則匹配並提取變數名稱
2. **不處理巢狀大括號**：不支援 `{{...}}` 這類嵌套
3. **逗號結尾**：`{x,}` 可能被匹配，但變數名為空

---

## 11. 各層級測試涵蓋範圍

測試資料來源：[uritemplate-test](https://github.com/uri-templates/uritemplate-test) 官方套件

### 11.1 `spec-examples.json`

| 層級 | 測試數 | 涵蓋運算子 | 說明 |
|:---:|:---:|:---|------|
| Level 1 | 3 | *(none)* | 基本字串展開 |
| Level 2 | 4 | `+` | Reserved Expansion |
| Level 3 | 15 | `+`, `#`, `.`, `/`, `;`, `?`, `&` | 全運算子 + 多變數 |
| Level 4 | 50 | 同上 + 修飾詞 | `*` explode, `:N` prefix-length, 陣列/關聯陣列 |

### 11.2 `extended-tests.json`

| 章節 | 測試數 | 說明 |
|:---:|:---:|------|
| Additional 1 | 14 | 真實世界範例（多結構組合） |
| Additional 2 | 2 | Path + Query 組合 |
| Additional 3: Empty | 6 | 空陣列/空關聯陣列 |
| Additional 4: Numeric Keys | 5 | 數字變數名稱 |
| Additional 5: Explode Combinations | 4 | Explode 組合情境 |
| Additional 6: Reserved Expansion | 12 | 預編碼值（含已知 `uri-template-lite` 限制） |

### 11.3 `negative-tests.json`

| 測試數 | 說明 |
|:---:|:------|
| 29 | 無效模板（RFC 6570 不合規語法） |

---

## 12. 錯誤訊息

當 `rfc6570ToRouter` 遇到不支援語法時拋出的錯誤：

```
TypeError: only can convert base rule, but got {?query,number}
```

錯誤訊息中的 `{?query,number}` 為**完整匹配到的模板表達式**（含大括號）。

---

## 13. 快速決策樹

```
我有一個 URI 模板，想……？
│
├── 展開它（填入參數產生 URL）
│   → 使用 expandRfc6570()
│      ✅ 支援完整 RFC 6570（Level 1 ~ 4）
│      ⚠️ 注意：uri-template-lite 對預編碼值有雙重編碼限制
│      ⚠️ 注意：無效模板不拋錯
│
├── 轉成 Router URI :varname 格式
│   → 使用 rfc6570ToRouter()
│      ✅ 支援 {var} / {+var}
│      ❌ 其餘運算子 + 多變數 + 修飾詞
│      💡 使用 { ignoreUnSupport: true } 保留不支援語法
│
├── 從 Router URI 轉成 RFC 6570
│   → 使用 routerToRfc6570()
│      ✅ 完整支援 :varname → {+var}
│
├── 提取模板中的所有變數名
│   → 使用 parseRouterVars()
│      ✅ 支援所有 8 種運算子
│      ✅ 正確處理逗號多變數
│      ✅ 正確移除 * 和 :N 修飾詞
│
└── 檢查某個表達式是否可轉換
    → 使用 _notSupport()
       ⚠️ 僅檢查「全非字元」極端情況
       💡 實際轉換與否應以 rfc6570ToRouter 行為為準
```

---

## 參考

- [RFC 6570 - URI Template](https://tools.ietf.org/html/rfc6570)
- [uri-template-lite](https://github.com/litejs/uri-template-lite) — 展開引擎
- [uritemplate-test](https://github.com/uri-templates/uritemplate-test) — 官方測試套件
- [Octokit endpoint.js](https://github.com/octokit/endpoint.js/blob/master/src/parse.ts) — Router 語法參考來源
