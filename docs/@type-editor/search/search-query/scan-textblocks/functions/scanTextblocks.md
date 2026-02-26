[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [search-query/scan-textblocks](../README.md) / scanTextblocks

# Function: scanTextblocks()

```ts
function scanTextblocks<T>(node, from, to, callback, nodeStart?): T;
```

Defined in: [search-query/scan-textblocks.ts:17](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/search-query/scan-textblocks.ts#L17)

Scans through text blocks in a document tree, calling a callback for each text block
that intersects with the given range.

Supports both forward scanning (from \< to) and backward scanning (from \> to).

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter   | Type                        | Default value | Description                                                                     |
| ----------- | --------------------------- | ------------- | ------------------------------------------------------------------------------- |
| `node`      | `Node_2`                    | `undefined`   | The node to scan                                                                |
| `from`      | `number`                    | `undefined`   | The start position of the range                                                 |
| `to`        | `number`                    | `undefined`   | The end position of the range                                                   |
| `callback`  | (`node`, `startPos`) => `T` | `undefined`   | Function called for each text block, should return a result or null to continue |
| `nodeStart` | `number`                    | `0`           | The starting position of the current node in the document                       |

## Returns

`T`

The first non-null result from the callback, or null if none found
