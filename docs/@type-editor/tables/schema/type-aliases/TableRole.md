[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [schema](../README.md) / TableRole

# Type Alias: TableRole

```ts
type TableRole = "table" | "row" | "cell" | "header_cell";
```

Defined in: [tables/src/schema.ts:366](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/schema.ts#L366)

Identifies the role of a node within a table structure.

- `'table'`: The root table node
- `'row'`: A table row node
- `'cell'`: A regular table cell (td)
- `'header_cell'`: A header table cell (th)
