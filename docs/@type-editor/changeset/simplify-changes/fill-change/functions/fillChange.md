[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [simplify-changes/fill-change](../README.md) / fillChange

# Function: fillChange()

```ts
function fillChange(changes, fromB, toB): Change;
```

Defined in: [simplify-changes/fill-change.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/simplify-changes/fill-change.ts#L17)

Creates a merged change that spans from fromB to toB, filling gaps between changes.

This function takes a sequence of changes and creates a single change that covers
a broader range, filling any gaps between the original changes. The gaps are filled
with spans using the data from adjacent changes.

## Parameters

| Parameter | Type                                                                  | Description                             |
| --------- | --------------------------------------------------------------------- | --------------------------------------- |
| `changes` | readonly [`Change`](../../../Change/classes/Change.md)&lt;`any`&gt;[] | The array of changes to merge.          |
| `fromB`   | `number`                                                              | The start position in the new document. |
| `toB`     | `number`                                                              | The end position in the new document.   |

## Returns

[`Change`](../../../Change/classes/Change.md)

A new Change covering the expanded range.
