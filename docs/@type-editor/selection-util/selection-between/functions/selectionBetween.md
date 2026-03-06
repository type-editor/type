[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [selection-between](../README.md) / selectionBetween

# Function: selectionBetween()

```ts
function selectionBetween(view, $anchor, $head, bias?): PmSelection;
```

Defined in: [selection-between.ts:19](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/selection-util/src/selection/selection-between.ts#L19)

Creates a selection between two resolved positions.

This function first checks if any plugins provide a custom 'createSelectionBetween'
method. If not, it falls back to creating a standard text selection. This allows
plugins to implement custom selection types (e.g., table cell selections).

## Parameters

| Parameter | Type           | Description                                                                |
| --------- | -------------- | -------------------------------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view                                                            |
| `$anchor` | `ResolvedPos`  | The resolved anchor position                                               |
| `$head`   | `ResolvedPos`  | The resolved head position                                                 |
| `bias?`   | `number`       | Optional bias for the selection direction (1 for forward, -1 for backward) |

## Returns

`PmSelection`

The created selection
