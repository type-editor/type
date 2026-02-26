[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/cell-wrapping](../README.md) / cellWrapping

# Function: cellWrapping()

```ts
function cellWrapping($pos): Node_2;
```

Defined in: [tables/src/utils/cell-wrapping.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/cell-wrapping.ts#L24)

Finds the cell node that wraps the given position.

Unlike cellAround, this function returns the actual cell node
rather than a resolved position. It checks the current depth and all
ancestor nodes to find a cell.

## Parameters

| Parameter | Type          | Description                           |
| --------- | ------------- | ------------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position to search from. |

## Returns

`Node_2`

The cell node wrapping the position, or null if not inside a cell.

## Example

```typescript
const cellNode = cellWrapping(state.selection.$head);
if (cellNode) {
  console.log("Cell colspan:", cellNode.attrs.colspan);
}
```
