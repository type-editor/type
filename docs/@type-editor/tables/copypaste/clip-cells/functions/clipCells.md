[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [copypaste/clip-cells](../README.md) / clipCells

# Function: clipCells()

```ts
function clipCells(area, newWidth, newHeight): Area;
```

Defined in: [tables/src/copypaste/clip-cells.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/copypaste/clip-cells.ts#L30)

Clips or extends (repeats) a set of cells to cover the given dimensions.

This function adjusts the cell area to match the target width and height:

- If the area is smaller, cells are repeated to fill the space
- If the area is larger, cells are clipped
- Cells with rowspan/colspan that extend beyond boundaries are trimmed

## Parameters

| Parameter   | Type                                                       | Description                                           |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| `area`      | [`Area`](../../../types/copypaste/Area/interfaces/Area.md) | The original area containing width, height, and rows. |
| `newWidth`  | `number`                                                   | The target width (number of columns).                 |
| `newHeight` | `number`                                                   | The target height (number of rows).                   |

## Returns

[`Area`](../../../types/copypaste/Area/interfaces/Area.md)

A new [Area](../../../types/copypaste/Area/interfaces/Area.md) with the adjusted dimensions.

## Example

```typescript
// Clip a 3x3 area to 2x2
const clipped = clipCells(originalArea, 2, 2);

// Extend a 2x2 area to 4x4 by repeating
const extended = clipCells(originalArea, 4, 4);
```
