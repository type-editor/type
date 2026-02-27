[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/col-count](../README.md) / colCount

# Function: colCount()

```ts
function colCount($pos): number;
```

Defined in: [tables/src/utils/col-count.ts:21](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/col-count.ts#L21)

Gets the column index of the cell at the given position.

For cells that span multiple columns, this returns the index of the
leftmost column the cell occupies.

## Parameters

| Parameter | Type          | Description                                       |
| --------- | ------------- | ------------------------------------------------- |
| `$pos`    | `ResolvedPos` | A resolved position pointing at or within a cell. |

## Returns

`number`

The zero-based column index of the cell.

## Example

```typescript
const column = colCount($cellPos);
console.log(`Cell is in column ${column}`);
```
