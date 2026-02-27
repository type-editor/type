[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [input/escape-table-down](../README.md) / escapeTableDown

# Variable: escapeTableDown

```ts
const escapeTableDown: Command;
```

Defined in: [tables/src/input/escape-table-down.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/input/escape-table-down.ts#L22)

Command that handles ArrowDown when the cursor is in the last row of a table
and there is no selectable content after the table.

In this case the browser would normally jump to the content _before_ the table
(e.g. the heading above it). This command intercepts that situation and instead
inserts a new empty paragraph directly after the table, placing the cursor inside it.

The command is a no-op (returns false) when:

- The cursor is not inside a table cell.
- The cursor is not in the last row of the table.
- There is already selectable content after the table.
