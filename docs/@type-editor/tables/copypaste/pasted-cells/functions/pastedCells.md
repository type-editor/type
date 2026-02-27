[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [copypaste/pasted-cells](../README.md) / pastedCells

# Function: pastedCells()

```ts
function pastedCells(slice): Area;
```

Defined in: [tables/src/copypaste/pasted-cells.ts:38](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/copypaste/pasted-cells.ts#L38)

Extracts a rectangular area of cells from a slice.

This function analyzes the content of a slice and, if it contains table cells
or rows, extracts them into a normalized rectangular [Area](../../../types/copypaste/Area/interfaces/Area.md) structure.
The function handles partial selections by fitting them into complete rows.

## Parameters

| Parameter | Type    | Description                                                            |
| --------- | ------- | ---------------------------------------------------------------------- |
| `slice`   | `Slice` | The slice to extract cells from, typically from a clipboard operation. |

## Returns

[`Area`](../../../types/copypaste/Area/interfaces/Area.md)

A rectangular [Area](../../../types/copypaste/Area/interfaces/Area.md) containing the cells, or `null` if the slice
doesn't contain table cells or rows.

## Example

```typescript
const slice = view.state.doc.slice(from, to);
const cells = pastedCells(slice);
if (cells) {
  console.log(`Pasted ${cells.width}x${cells.height} cells`);
}
```
