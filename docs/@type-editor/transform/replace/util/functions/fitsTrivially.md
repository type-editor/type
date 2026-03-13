[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/util](../README.md) / fitsTrivially

# Function: fitsTrivially()

```ts
function fitsTrivially($from, $to, slice): boolean;
```

Defined in: [packages/transform/src/replace/util.ts:89](https://github.com/type-editor/type/blob/4813813a587dda7eec62dd72332119887ded8d65/packages/transform/src/replace/util.ts#L89)

Check if a slice fits trivially at the given position without needing complex fitting logic.

## Parameters

| Parameter | Type          | Description             |
| --------- | ------------- | ----------------------- |
| `$from`   | `ResolvedPos` | Resolved start position |
| `$to`     | `ResolvedPos` | Resolved end position   |
| `slice`   | `Slice`       | The slice to check      |

## Returns

`boolean`

True if the slice fits trivially
