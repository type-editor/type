[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [SearchQuery](../README.md) / SearchQuery

# Class: SearchQuery

Defined in: [SearchQuery.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L24)

## Constructors

### Constructor

```ts
new SearchQuery(config): SearchQuery;
```

Defined in: [SearchQuery.ts:72](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L72)

Creates a new search query object.

#### Parameters

| Parameter | Type                                                                                 | Description                                |
| --------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| `config`  | [`SearchQueryConfig`](../../types/SearchQueryConfig/interfaces/SearchQueryConfig.md) | Configuration options for the search query |

#### Returns

`SearchQuery`

## Accessors

### caseSensitive

#### Get Signature

```ts
get caseSensitive(): boolean;
```

Defined in: [SearchQuery.ts:98](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L98)

Gets whether the search is case-sensitive.

##### Returns

`boolean`

---

### search

#### Get Signature

```ts
get search(): string;
```

Defined in: [SearchQuery.ts:91](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L91)

Gets the search string or regular expression pattern.

##### Returns

`string`

---

### valid

#### Get Signature

```ts
get valid(): boolean;
```

Defined in: [SearchQuery.ts:105](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L105)

Gets whether this query is valid (non-empty and syntactically correct if regex).

##### Returns

`boolean`

## Methods

### eq()

```ts
eq(other): boolean;
```

Defined in: [SearchQuery.ts:116](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L116)

Compares this query to another query for equality.
Two queries are equal if all their configuration options match.

#### Parameters

| Parameter | Type          | Description               |
| --------- | ------------- | ------------------------- |
| `other`   | `SearchQuery` | The query to compare with |

#### Returns

`boolean`

`true` if the queries are equal, `false` otherwise

---

### findNext()

```ts
findNext(
   state,
   from?,
   to?): SearchResult;
```

Defined in: [SearchQuery.ts:135](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L135)

Finds the next occurrence of this query in the given range.
The search continues forward from the `from` position until a match is found
or the end of the range is reached.

#### Parameters

| Parameter | Type            | Default value            | Description                                           |
| --------- | --------------- | ------------------------ | ----------------------------------------------------- |
| `state`   | `PmEditorState` | `undefined`              | The editor state to search in                         |
| `from`    | `number`        | `0`                      | The position to start searching from (default: 0)     |
| `to`      | `number`        | `state.doc.content.size` | The position to search up to (default: document size) |

#### Returns

[`SearchResult`](../../types/SearchResult/interfaces/SearchResult.md)

The search result if found, or `null` if no match exists

---

### findPrev()

```ts
findPrev(
   state,
   from?,
   to?): SearchResult;
```

Defined in: [SearchQuery.ts:168](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L168)

Finds the previous occurrence of this query in the given range.
The search continues backward from the `from` position until a match is found
or the start of the range is reached.

Note: When searching backward, `from` should be greater than `to`.

#### Parameters

| Parameter | Type            | Default value            | Description                                                   |
| --------- | --------------- | ------------------------ | ------------------------------------------------------------- |
| `state`   | `PmEditorState` | `undefined`              | The editor state to search in                                 |
| `from`    | `number`        | `state.doc.content.size` | The position to start searching from (default: document size) |
| `to`      | `number`        | `0`                      | The position to search back to (default: 0)                   |

#### Returns

[`SearchResult`](../../types/SearchResult/interfaces/SearchResult.md)

The search result if found, or `null` if no match exists

---

### getReplacements()

```ts
getReplacements(state, result): ReplacementRange[];
```

Defined in: [SearchQuery.ts:233](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L233)

Generates the ranges that should be replaced for a search result.
This can return multiple ranges when `this.replace` contains capture group
placeholders like `$1`, `$2`, or `$&`, in which case the preserved
content is skipped by the replacements.

Ranges are sorted by position, and `from`/`to` positions all
refer to positions in `state.doc`. When applying these, you should
either apply them from back to front, or map these positions
through your transaction's current mapping.

#### Parameters

| Parameter | Type                                                                  | Description                                    |
| --------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| `state`   | `PmEditorState`                                                       | The editor state containing the document       |
| `result`  | [`SearchResult`](../../types/SearchResult/interfaces/SearchResult.md) | The search result to generate replacements for |

#### Returns

[`ReplacementRange`](../../types/ReplacementRange/interfaces/ReplacementRange.md)[]

An array of replacement ranges with their insertion slices

---

### unquote()

```ts
unquote(text): string;
```

Defined in: [SearchQuery.ts:197](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/SearchQuery.ts#L197)

Processes escape sequences in the given text.
If `literal` mode is enabled, returns text as-is.
Otherwise, replaces escape sequences: `\n` → newline, `\r` → return, `\t` → tab, `\\` → backslash.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `text`    | `string` | The text to process |

#### Returns

`string`

The processed text with escape sequences replaced (unless in literal mode)
