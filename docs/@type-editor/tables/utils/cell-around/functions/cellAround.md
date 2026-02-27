[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/cell-around](../README.md) / cellAround

# Function: cellAround()

```ts
function cellAround($pos): ResolvedPos;
```

Defined in: [tables/src/utils/cell-around.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/cell-around.ts#L22)

Finds the resolved position of the cell containing the given position.

This function walks up the document tree from the given position to find
the nearest cell boundary. It returns a resolved position pointing to the
start of the cell node.

## Parameters

| Parameter | Type          | Description                           |
| --------- | ------------- | ------------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position to search from. |

## Returns

`ResolvedPos`

The resolved position of the containing cell, or null if the
position is not inside a table cell.

## Example

```typescript
const $cell = cellAround(state.selection.$head);
if ($cell) {
  console.log("Cursor is in cell at position:", $cell.pos);
}
```
