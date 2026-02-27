[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/query](../README.md) / findCellRange

# Function: findCellRange()

```ts
function findCellRange(
  selection,
  anchorHit?,
  headHit?,
): [ResolvedPos, ResolvedPos];
```

Defined in: [tables/src/utils/query.ts:139](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/query.ts#L139)

Finds the anchor and head cell positions for a table cell selection.

This function attempts to determine the cell range for a selection using the following strategy:

1. If no hit points are provided and the selection is already a [CellSelection](../../../cellselection/CellSelection/classes/CellSelection.md),
   returns the existing anchor and head cells.
2. Otherwise, uses the provided hit points (or falls back to the selection's anchor/head)
   to find the corresponding cells.
3. Validates that both cells are in the same table before returning.

## Parameters

| Parameter    | Type          | Description                                                                                                      |
| ------------ | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `selection`  | `PmSelection` | The current editor selection.                                                                                    |
| `anchorHit?` | `number`      | Optional position to use as the anchor hit point. Falls back to `headHit` or `selection.anchor` if not provided. |
| `headHit?`   | `number`      | Optional position to use as the head hit point. Falls back to `anchorHit` or `selection.head` if not provided.   |

## Returns

\[`ResolvedPos`, `ResolvedPos`\]

A tuple of `[anchorCell, headCell]` resolved positions if both cells are found
in the same table, or `null` if no valid cell range can be determined.

## Example

```typescript
// Get cell range from existing cell selection
const range = findCellRange(state.selection);

// Get cell range using specific hit points
const range = findCellRange(state.selection, mouseDownPos, mouseMovePos);

if (range) {
  const [$anchorCell, $headCell] = range;
  // Create a new cell selection...
}
```
