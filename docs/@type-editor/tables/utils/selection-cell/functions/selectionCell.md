[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/selection-cell](../README.md) / selectionCell

# Function: selectionCell()

```ts
function selectionCell(state): ResolvedPos;
```

Defined in: [tables/src/utils/selection-cell.ts:32](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/utils/selection-cell.ts#L32)

Gets the resolved position of the "main" cell in the current selection.

For cell selections, returns the position of the cell that is furthest
in document order (comparing anchor and head). For node selections of a cell,
returns the anchor position. For other selections, finds the nearest cell.

## Parameters

| Parameter | Type            | Description               |
| --------- | --------------- | ------------------------- |
| `state`   | `PmEditorState` | The current editor state. |

## Returns

`ResolvedPos`

The resolved position pointing to the selected cell.

## Throws

RangeError if no cell can be found around the selection.

## Example

```typescript
try {
  const $cell = selectionCell(state);
  console.log("Selected cell at position:", $cell.pos);
} catch (e) {
  console.log("Not in a table cell");
}
```
