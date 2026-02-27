[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/find-extended-mark-selection](../README.md) / findExtendedMarkSelection

# Function: findExtendedMarkSelection()

```ts
function findExtendedMarkSelection(
  doc,
  $cursor,
  markType,
  onlyNumbers,
): ExtendedSelectionResult;
```

Defined in: [util/find-extended-mark-selection.ts:38](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/util/find-extended-mark-selection.ts#L38)

Attempts to find an extended selection for an empty selection.

If the cursor is within a range that has the specified mark type, extends
the selection to cover the entire contiguous marked range. This is useful
for toggling marks like links where the user positions the cursor inside
the linked text and expects the entire link to be toggled.

If not within a marked range, falls back to selecting a single adjacent
character (first checking before, then after the cursor).

## Parameters

| Parameter     | Type          | Description                                |
| ------------- | ------------- | ------------------------------------------ |
| `doc`         | `Node_2`      | The document node                          |
| `$cursor`     | `ResolvedPos` | The resolved cursor position               |
| `markType`    | `MarkType`    | The mark type to check for range extension |
| `onlyNumbers` | `boolean`     | Whether to only select numeric characters  |

## Returns

[`ExtendedSelectionResult`](../interfaces/ExtendedSelectionResult.md)

Information about the extended selection
