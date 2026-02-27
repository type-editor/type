[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [search-query/RegExpQuery](../README.md) / RegExpQuery

# Class: RegExpQuery

Defined in: [search-query/RegExpQuery.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/search-query/RegExpQuery.ts#L14)

Query implementation for regular expression searches.
Handles pattern matching with capture groups.

## Extends

- [`AbstractQueryImpl`](../../AbstractQueryImpl/classes/AbstractQueryImpl.md)

## Implements

- [`QueryImpl`](../../../types/QueryImpl/interfaces/QueryImpl.md)

## Constructors

### Constructor

```ts
new RegExpQuery(query): RegExpQuery;
```

Defined in: [search-query/RegExpQuery.ts:25](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/search-query/RegExpQuery.ts#L25)

Creates a new regular expression query implementation.

#### Parameters

| Parameter | Type                                                         | Description                           |
| --------- | ------------------------------------------------------------ | ------------------------------------- |
| `query`   | [`SearchQuery`](../../../SearchQuery/classes/SearchQuery.md) | The parent search query configuration |

#### Returns

`RegExpQuery`

#### Overrides

[`AbstractQueryImpl`](../../AbstractQueryImpl/classes/AbstractQueryImpl.md).[`constructor`](../../AbstractQueryImpl/classes/AbstractQueryImpl.md#constructor)

## Methods

### findNext()

```ts
findNext(
   state,
   from,
   to): SearchResult;
```

Defined in: [search-query/RegExpQuery.ts:39](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/search-query/RegExpQuery.ts#L39)

Finds the next occurrence matching the regular expression in the document.

#### Parameters

| Parameter | Type            | Description                          |
| --------- | --------------- | ------------------------------------ |
| `state`   | `PmEditorState` | The editor state to search in        |
| `from`    | `number`        | The position to start searching from |
| `to`      | `number`        | The position to search up to         |

#### Returns

[`SearchResult`](../../../types/SearchResult/interfaces/SearchResult.md)

The search result with match details if found, or `null` if no match exists

#### Implementation of

[`QueryImpl`](../../../types/QueryImpl/interfaces/QueryImpl.md).[`findNext`](../../../types/QueryImpl/interfaces/QueryImpl.md#findnext)

---

### findPrev()

```ts
findPrev(
   state,
   from,
   to): SearchResult;
```

Defined in: [search-query/RegExpQuery.ts:76](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/search-query/RegExpQuery.ts#L76)

Finds the previous occurrence matching the regular expression in the document.
Since regex doesn't support backward search, this iterates forward to find the last match.

#### Parameters

| Parameter | Type            | Description                          |
| --------- | --------------- | ------------------------------------ |
| `state`   | `PmEditorState` | The editor state to search in        |
| `from`    | `number`        | The position to start searching from |
| `to`      | `number`        | The position to search back to       |

#### Returns

[`SearchResult`](../../../types/SearchResult/interfaces/SearchResult.md)

The search result with match details if found, or `null` if no match exists

#### Implementation of

[`QueryImpl`](../../../types/QueryImpl/interfaces/QueryImpl.md).[`findPrev`](../../../types/QueryImpl/interfaces/QueryImpl.md#findprev)

---

### scanTextblocks()

```ts
protected scanTextblocks<T>(
   node,
   from,
   to,
   callback,
   nodeStart?): T;
```

Defined in: [search-query/AbstractQueryImpl.ts:29](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/search-query/AbstractQueryImpl.ts#L29)

Scans through text blocks in a document tree, calling a callback for each text block
that intersects with the given range.

Supports both forward scanning (from \< to) and backward scanning (from \> to).

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter   | Type                        | Default value | Description                                                                     |
| ----------- | --------------------------- | ------------- | ------------------------------------------------------------------------------- |
| `node`      | `Node_2`                    | `undefined`   | The node to scan                                                                |
| `from`      | `number`                    | `undefined`   | The start position of the range                                                 |
| `to`        | `number`                    | `undefined`   | The end position of the range                                                   |
| `callback`  | (`node`, `startPos`) => `T` | `undefined`   | Function called for each text block, should return a result or null to continue |
| `nodeStart` | `number`                    | `0`           | The starting position of the current node in the document                       |

#### Returns

`T`

The first non-null result from the callback, or null if none found

#### Inherited from

[`AbstractQueryImpl`](../../AbstractQueryImpl/classes/AbstractQueryImpl.md).[`scanTextblocks`](../../AbstractQueryImpl/classes/AbstractQueryImpl.md#scantextblocks)

---

### textContent()

```ts
protected textContent(node): string;
```

Defined in: [search-query/AbstractQueryImpl.ts:90](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/search-query/AbstractQueryImpl.ts#L90)

Extracts the text content from a node, with caching for performance.

- Text nodes contribute their text
- Leaf nodes (like images) are represented by the Object Replacement Character (U+FFFC)
- Block nodes have their content extracted recursively with spaces around them

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `node`    | `Node_2` | The node to extract text content from |

#### Returns

`string`

The text content of the node

#### Inherited from

[`AbstractQueryImpl`](../../AbstractQueryImpl/classes/AbstractQueryImpl.md).[`textContent`](../../AbstractQueryImpl/classes/AbstractQueryImpl.md#textcontent)
