[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [anchor-in-right-place](../README.md) / anchorInRightPlace

# Function: anchorInRightPlace()

```ts
function anchorInRightPlace(view): boolean;
```

Defined in: [anchor-in-right-place.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/selection-util/src/selection/anchor-in-right-place.ts#L15)

Checks if the DOM selection's anchor is at the expected position.

This compares the ProseMirror selection's anchor position with the actual
DOM selection's anchor position to verify they are equivalent. This is useful
for detecting if the DOM selection has drifted from the expected state.

## Parameters

| Parameter | Type           | Description              |
| --------- | -------------- | ------------------------ |
| `view`    | `PmEditorView` | The editor view to check |

## Returns

`boolean`

True if the DOM anchor matches the ProseMirror selection anchor
