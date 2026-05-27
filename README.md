# router-uri-convert

將 Router URI 語法（`:varname`，源自 Express.js / Octokit）與 [RFC 6570 URI Template](https://tools.ietf.org/html/rfc6570) 之間進行雙向轉換的工具模組。

Converts between Router URI syntax (`:varname`, from Express.js / Octokit) and [RFC 6570 URI Template](https://tools.ietf.org/html/rfc6570).

---

## Installation

```sh
yarn add router-uri-convert
```

```sh
pnpm add router-uri-convert
```

---

## API

### `routerToRfc6570(url: string): string`

將 Router 語法轉換為 RFC 6570 相容格式。

將 `:varname` 替換為 `{+varname}`。

```ts
import { routerToRfc6570 } from 'router-uri-convert';

// 基本用法 / Basic usage
routerToRfc6570('/users/:user');
// → '/users/{+user}'

routerToRfc6570('/api/v1/:resource/:id');
// → '/api/v1/{+resource}/{+id}'
```

---

### `rfc6570ToRouter(url: string, opts?: IRfc6570ToRouterOptions): string`

將 RFC 6570 格式轉換回 Router 語法。

將 `{varname}` / `{+varname}` 替換回 `:varname`。

```ts
import { rfc6570ToRouter } from 'router-uri-convert';

// 基本用法 / Basic usage
rfc6570ToRouter('/users/{+user}');
// → '/users/:user'

rfc6570ToRouter('/api/v1/{+resource}/{+id}');
// → '/api/v1/:resource/:id'
```

#### `opts.ignoreUnSupport`

Router URI 格式是 RFC 6570 的**真子集**（proper subset），僅能表達簡單路徑參數。當遇到不支援的 RFC 6570 語法（如運算子 `?` `#` `/` `;` `&` `.`、逗號多變數 `{x,y}`、修飾詞 `*` `:N`）時：

| `ignoreUnSupport` | 行為 |
|---|---|
| `false` (預設) | 拋出 `TypeError` |
| `true` | 保留原 `{...}` 不轉換 |

```ts
// 預設：不支援語法拋錯 / Default: throws on unsupported syntax
rfc6570ToRouter('/api/{?query,number}');
// → TypeError: only can convert base rule, but got {?query,number}

// ignoreUnSupport: true → 保留原樣 / keep original
rfc6570ToRouter('/api/{?query,number}', { ignoreUnSupport: true });
// → '/api/{?query,number}'（原樣保留 / kept as-is）
```

---

### `_notSupport(w: string, throwError?: boolean): boolean | void`

檢查變數名稱是否包含不支援的規則。僅檢查純符號類型的變數（如 `{?}`、`{#}`）。

```ts
import { _notSupport } from 'router-uri-convert';

_notSupport('?query,number'); // → false（含有字元，不觸發此舊檢查，但實際仍不支援）
_notSupport('?');             // → true（純符號，不支援）
_notSupport('+');             // → true
```

> **注意**：此函數僅檢查「全非單字字元」這種極端情況。更全面的支援性檢查由 `rfc6570ToRouter` 內部的 `_isSupportedRouterVar` 處理。

---

### `expandRfc6570(url: string, data: Record<string, unknown>): ExpandResult`

展開 RFC 6570 URI 模板，並自動將展開結果分離為**路徑參數**與**一般資料參數**。

Expands an RFC 6570 URI template and automatically separates the result into **path parameters** and **data parameters**.

```ts
import { expandRfc6570 } from 'router-uri-convert/parser';

const result = expandRfc6570('/users/{+user}', { user: 'foo/bar' });
// →
// {
//   router: '/users/{+user}',
//   url: '/users/foo/bar',
//   paths: { user: 'foo/bar' },
//   data: {}
// }
```

```ts
// 完整 RFC 6570 語法支援（運算子、多變數、修飾詞）
// Full RFC 6570 syntax support (operators, multi-variables, modifiers)
expandRfc6570('http://{domain}/~{user}/foo{?query,number}', {
  domain: 'example.com',
  user: 'fred',
  query: 'mycelium',
  number: 3,
});
// →
// {
//   router: 'http://{domain}/~{user}/foo{?query,number}',
//   url: 'http://example.com/~fred/foo?query=mycelium&number=3',
//   paths: { domain: 'example.com', user: 'fred' },
//   data: { query: 'mycelium', number: 3 }
// }
```

> **已知上游限制**：底層依賴 `uri-template-lite`，存在數項已知行為差異（如 Reserved Expansion 雙重編碼、boolean 處理、無效模板不拋錯等）。詳見 [`docs/known-upstream-limitations.md`](docs/known-upstream-limitations.md)。
>
> **Known upstream limitations**: The underlying `uri-template-lite` library has several known behavioral differences (e.g., double-encoding in Reserved Expansion, boolean handling, non-throwing for invalid templates, etc.). See [`docs/known-upstream-limitations.md`](docs/known-upstream-limitations.md).

---

### `matchRfc6570(template: string, uri: string): Record<string, string> | undefined`

將 URI 與 RFC 6570 模板進行匹配，提取變數值（已解碼）。

Matches a URI against an RFC 6570 template and extracts decoded variable values.

```ts
import { matchRfc6570 } from 'router-uri-convert/parser';

// 基礎匹配 / Basic matching
matchRfc6570('/users/{+user}', '/users/foo/bar');
// → { user: 'foo/bar' }

// 多變數匹配 / Multi-variable matching
matchRfc6570('/api{/version}/users{?page,limit}', '/api/v1/users?page=1&limit=10');
// → { version: 'v1', page: '1', limit: '10' }

// 不匹配 → undefined / No match → undefined
matchRfc6570('/users/{+user}', '/other/path');
// → undefined
```

> **已知上游限制**：match 層亦有已知限制（explode list\* 回傳錯誤陣列、query 多變數 round-trip 不對稱性）。詳見 [`docs/known-upstream-limitations.md`](docs/known-upstream-limitations.md)。
>
> **Known upstream limitations**: The match layer also has known limitations (wrong array for explode list\*, query multi-variable round-trip asymmetry). See [`docs/known-upstream-limitations.md`](docs/known-upstream-limitations.md).

### `matchRouter(template: string, uri: string): Record<string, string> | undefined`

將 URI 與 Router 格式模板（`:varname`）進行匹配。

Matches a URI against a Router-format template (`:varname`).

```ts
import { matchRouter } from 'router-uri-convert/parser';

// 基礎匹配 / Basic matching
matchRouter('/users/:user', '/users/foo/bar');
// → { user: 'foo/bar' }

// 不匹配 → undefined / No match → undefined
matchRouter('/users/:user', '/other/path');
// → undefined
```

> **注意**：`matchRouter` 內部先呼叫 `routerToRfc6570` 轉換為 RFC 6570 格式後再進行匹配，因此支援與 `routerToRfc6570` 相同的變數語法（`:varname` → `{+varname}`）。

---

## 使用範例

### 雙向轉換 / Bidirectional conversion

```ts
import { routerToRfc6570, rfc6570ToRouter } from 'router-uri-convert';

const source = '/users/:user';

const rfc6570 = routerToRfc6570(source);
// → '/users/{+user}'

const back = rfc6570ToRouter(rfc6570);
// → '/users/:user'

// Round-trip 成立
expect(back).toBe(source);
```

### 使用 expandRfc6570 展開模板

```ts
import { expandRfc6570 } from 'router-uri-convert/parser';

// 直接使用 RFC 6570 語法展開 / Expand directly with RFC 6570 syntax
const result = expandRfc6570('/users/{+user}', { user: 'foo/bar' });
// → { router: '/users/{+user}', url: '/users/foo/bar', ... }
```

### 配合 matchRfc6570 進行 round-trip

```ts
import { expandRfc6570, matchRfc6570 } from 'router-uri-convert/parser';

// 先展開 / Expand first
const expanded = expandRfc6570('/users/{+user}', { user: 'foo/bar' });
// expanded.url → '/users/foo/bar'

// 再匹配還原 / Then match back
const matched = matchRfc6570('/users/{+user}', expanded.url);
// matched → { user: 'foo/bar' }
```

---

## 匯出路徑

| 函數 | 匯出路徑 |
|------|---------|
| `routerToRfc6570` | `router-uri-convert` |
| `rfc6570ToRouter` | `router-uri-convert` |
| `_notSupport` | `router-uri-convert` |
| `expandRfc6570` | `router-uri-convert/parser` |
| `matchRfc6570` | `router-uri-convert/parser` |
| `matchRouter` | `router-uri-convert/parser` |
| `parseRouterVars` | `router-uri-convert/parser` |

---

## RFC 6570 語法支援度

### 支援轉換（Router ↔ RFC 6570）

| 語法 | Router | RFC 6570 | 說明 |
|------|--------|----------|------|
| 簡單變數 | `:user` | `{+user}` | Round-trip 完全支援 |

### 不支援轉換（僅 RFC 6570 端）

以下 RFC 6570 語法**沒有Router URI 對應**，無法進行 `rfc6570ToRouter` 的雙向轉換：

| 類別 | 範例 | 說明 |
|------|------|------|
| 運算子 | `{?query,number}` `{#frag}` `{/path}` `{;x,y}` `{&x,y}` `{.sub}` | 表達式類型 |
| 多變數 | `{x,y}` `{?x,y}` | 逗號分隔多個變數 |
| Explode 修飾詞 | `{keys*}` | `*` 展開運算 |
| Prefix-length | `{var:3}` | `:N` 截斷運算 |

若需要使用這些語法，請傳入 `{ ignoreUnSupport: true }` 讓 `{...}` 保留原樣通過轉換：

```ts
const url = '/api/{?query,number}/items';
const router = rfc6570ToRouter(url, { ignoreUnSupport: true });
// → '/api/{?query,number}/items'（不轉換 `{?query,number}`，因為無 Router 對應）

// 再轉回 RFC 6570 時亦維持原樣 / Back to RFC 6570 unchanged
routerToRfc6570(router);
// → '/api/{?query,number}/items'
```

---

## 測試

```sh
pnpm run test:snapshot
```

內部使用 `vitest` + snapshot testing。新增功能時請確保 `pnpm run test:snapshot` 通過。

指定單一測試檔：

```sh
pnpm run test:snapshot test/match-syntax.test.ts
pnpm run test:snapshot test/expand-syntax.test.ts
pnpm run test:snapshot test/uritemplate-test.test.ts
```

---

## 參考文件

| 文件 | 說明 |
|------|------|
| [`docs/rfc-6570-syntax-support.md`](docs/rfc-6570-syntax-support.md) | RFC 6570 語法完整支援度參照表 |
| [`docs/known-upstream-limitations.md`](docs/known-upstream-limitations.md) | `uri-template-lite` 已知上游限制與行為差異 |

---

## 相關連結

- [RFC 6570 - URI Template](https://tools.ietf.org/html/rfc6570)
- [Octokit endpoint.js](https://github.com/octokit/endpoint.js/blob/master/src/parse.ts) — Router 語法參考來源
- [uri-template-lite](https://github.com/litejs/uri-template-lite) — URI Template 展開引擎
