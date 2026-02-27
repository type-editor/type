[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/remove-col-span](../README.md) / removeColSpan

# Function: removeColSpan()

```ts
function removeColSpan(attrs, pos, n?): CellAttrs;
```

Defined in: [tables/src/utils/remove-col-span.ts:23](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/utils/remove-col-span.ts#L23)

Creates new cell attributes with reduced colspan.

Removes the specified number of columns from the cell's span,
updating the colwidth array accordingly. If all remaining column
widths are zero, the colwidth is set to null.

## Parameters

| Parameter | Type                                                            | Default value | Description                                                    |
| --------- | --------------------------------------------------------------- | ------------- | -------------------------------------------------------------- |
| `attrs`   | [`CellAttrs`](../../../types/CellAttrs/interfaces/CellAttrs.md) | `undefined`   | The current cell attributes.                                   |
| `pos`     | `number`                                                        | `undefined`   | The position within the colwidth array to start removing from. |
| `n`       | `number`                                                        | `1`           | The number of columns to remove. Defaults to 1.                |

## Returns

[`CellAttrs`](../../../types/CellAttrs/interfaces/CellAttrs.md)

A new CellAttrs object with the updated colspan and colwidth.

## Example

```typescript
const attrs = { colspan: 3, rowspan: 1, colwidth: [100, 200, 300] };
const newAttrs = removeColSpan(attrs, 1, 1);
// newAttrs = { colspan: 2, rowspan: 1, colwidth: [100, 300] }
```
