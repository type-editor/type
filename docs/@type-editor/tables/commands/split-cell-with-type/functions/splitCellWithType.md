[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/split-cell-with-type](../README.md) / splitCellWithType

# Function: splitCellWithType()

```ts
function splitCellWithType(getCellType): Command;
```

Defined in: [tables/src/commands/split-cell-with-type.ts:23](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/commands/split-cell-with-type.ts#L23)

Splits a selected cell into smaller cells with custom cell type determination.

This function allows specifying the cell type (th or td) for each new cell
via a callback function.

## Parameters

| Parameter     | Type                      | Description                                            |
| ------------- | ------------------------- | ------------------------------------------------------ |
| `getCellType` | (`options`) => `NodeType` | A function that returns the NodeType for each new cell |

## Returns

`Command`

A command that performs the split operation
