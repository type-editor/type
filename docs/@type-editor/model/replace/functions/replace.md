[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / [replace](../README.md) / replace

# Function: replace()

```ts
function replace($from, $to, slice): Node;
```

Defined in: [packages/model/src/replace.ts:43](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/replace.ts#L43)

Replace a range of content between two resolved positions with a slice.
This is the main entry point for performing document replacements.

## Parameters

| Parameter | Type                                                               | Description                                         |
| --------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| `$from`   | [`ResolvedPos`](../../elements/ResolvedPos/classes/ResolvedPos.md) | The resolved position where the replacement starts. |
| `$to`     | [`ResolvedPos`](../../elements/ResolvedPos/classes/ResolvedPos.md) | The resolved position where the replacement ends.   |
| `slice`   | [`Slice`](../../elements/Slice/classes/Slice.md)                   | The slice to insert between the positions.          |

## Returns

[`Node`](../../elements/Node/classes/Node.md)

The root node with the replacement applied.

## Throws

If the slice's open depth is invalid or inconsistent with the positions.
