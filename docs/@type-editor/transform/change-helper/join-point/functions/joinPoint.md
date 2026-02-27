[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-helper/join-point](../README.md) / joinPoint

# Function: joinPoint()

```ts
function joinPoint(doc, pos, dir?): number;
```

Defined in: [packages/transform/src/change-helper/join-point.ts:15](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-helper/join-point.ts#L15)

Find an ancestor of the given position that can be joined to the
block before (or after if `dir` is positive). Returns the joinable
point, if any.

## Parameters

| Parameter | Type     | Default value | Description                                                |
| --------- | -------- | ------------- | ---------------------------------------------------------- |
| `doc`     | `Node_2` | `undefined`   | The document to search in.                                 |
| `pos`     | `number` | `undefined`   | The position to start searching from.                      |
| `dir`     | `number` | `-1`          | Direction to search: -1 for before (default), 1 for after. |

## Returns

`number`

The position where a join can occur, or null if none found.
