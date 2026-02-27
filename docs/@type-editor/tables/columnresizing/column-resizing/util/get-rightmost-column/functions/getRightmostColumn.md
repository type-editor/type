[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/tables](../../../../../README.md) / [columnresizing/column-resizing/util/get-rightmost-column](../README.md) / getRightmostColumn

# Function: getRightmostColumn()

```ts
function getRightmostColumn(map, tableStart, $cell): number;
```

Defined in: [tables/src/columnresizing/column-resizing/util/get-rightmost-column.ts:14](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/columnresizing/column-resizing/util/get-rightmost-column.ts#L14)

Calculates the rightmost column index for a cell, accounting for colspan.

## Parameters

| Parameter    | Type                                                               | Description                                      |
| ------------ | ------------------------------------------------------------------ | ------------------------------------------------ |
| `map`        | [`TableMap`](../../../../../tablemap/TableMap/classes/TableMap.md) | The table map for the table containing the cell. |
| `tableStart` | `number`                                                           | The document position where the table starts.    |
| `$cell`      | `ResolvedPos`                                                      | The resolved position of the cell.               |

## Returns

`number`

The zero-based index of the rightmost column spanned by the cell.
