[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/util](../README.md) / fitsTrivially

# Function: fitsTrivially()

```ts
function fitsTrivially($from, $to, slice): boolean;
```

Defined in: [packages/transform/src/replace/util.ts:89](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/replace/util.ts#L89)

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
