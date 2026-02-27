[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [search-query/AbstractQueryImpl](../README.md) / AbstractQueryImpl

# Class: AbstractQueryImpl

Defined in: [search-query/AbstractQueryImpl.ts:4](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/search-query/AbstractQueryImpl.ts#L4)

## Extended by

- [`RegExpQuery`](../../RegExpQuery/classes/RegExpQuery.md)
- [`StringQuery`](../../StringQuery/classes/StringQuery.md)

## Constructors

### Constructor

```ts
new AbstractQueryImpl(): AbstractQueryImpl;
```

#### Returns

`AbstractQueryImpl`

## Methods

### scanTextblocks()

```ts
protected scanTextblocks<T>(
   node,
   from,
   to,
   callback,
   nodeStart?): T;
```

Defined in: [search-query/AbstractQueryImpl.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/search-query/AbstractQueryImpl.ts#L29)

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

---

### textContent()

```ts
protected textContent(node): string;
```

Defined in: [search-query/AbstractQueryImpl.ts:90](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/search-query/AbstractQueryImpl.ts#L90)

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
