[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/add-col-span](../README.md) / addColSpan

# Function: addColSpan()

```ts
function addColSpan(attrs, pos, n?): Attrs;
```

Defined in: [tables/src/utils/add-col-span.ts:25](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/utils/add-col-span.ts#L25)

Creates new cell attributes with increased colspan.

Adds the specified number of columns to the cell's span,
inserting zeros at the specified position in the colwidth array
if it exists.

## Parameters

| Parameter | Type                                                            | Default value | Description                                          |
| --------- | --------------------------------------------------------------- | ------------- | ---------------------------------------------------- |
| `attrs`   | [`CellAttrs`](../../../types/CellAttrs/interfaces/CellAttrs.md) | `undefined`   | The current cell attributes.                         |
| `pos`     | `number`                                                        | `undefined`   | The position within the colwidth array to insert at. |
| `n`       | `number`                                                        | `1`           | The number of columns to add. Defaults to 1.         |

## Returns

`Attrs`

A new attributes object with the updated colspan and colwidth.

## Example

```typescript
const attrs = { colspan: 2, rowspan: 1, colwidth: [100, 200] };
const newAttrs = addColSpan(attrs, 1, 1);
// newAttrs = { colspan: 3, rowspan: 1, colwidth: [100, 0, 200] }
```
