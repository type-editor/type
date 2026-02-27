[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-helper/drop-point](../README.md) / dropPoint

# Function: dropPoint()

```ts
function dropPoint(doc, pos, slice): number;
```

Defined in: [packages/transform/src/change-helper/drop-point.ts:13](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-helper/drop-point.ts#L13)

Finds a position at or around the given position where the given
slice can be inserted. Will look at parent nodes' nearest boundary
and try there, even if the original position wasn't directly at the
start or end of that node. Returns null when no position was found.

## Parameters

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `doc`     | `Node_2` | The document to search in.     |
| `pos`     | `number` | The position to search around. |
| `slice`   | `Slice`  | The slice to be inserted.      |

## Returns

`number`
