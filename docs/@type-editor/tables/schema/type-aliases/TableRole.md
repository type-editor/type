[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [schema](../README.md) / TableRole

# Type Alias: TableRole

```ts
type TableRole = "table" | "row" | "cell" | "header_cell";
```

Defined in: [tables/src/schema.ts:366](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/schema.ts#L366)

Identifies the role of a node within a table structure.

- `'table'`: The root table node
- `'row'`: A table row node
- `'cell'`: A regular table cell (td)
- `'header_cell'`: A header table cell (th)
