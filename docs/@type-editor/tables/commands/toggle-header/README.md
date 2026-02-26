[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / commands/toggle-header

# commands/toggle-header

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[toggleHeader](functions/toggleHeader.md)

</td>
<td>

Toggles between row/column header and normal cells.

The behavior depends on the `type` parameter:

- `'row'`: Toggles the first row between header and regular cells
- `'column'`: Toggles the first column between header and regular cells
- `'cell'`: Toggles the currently selected cells

When `useSelectedRowColumn` is true and type is 'row' or 'column',
the command toggles the selected row/column instead of the first one.

**Examples**

```ts
// Toggle first row as header
toggleHeader("row");
```

```ts
// Toggle selected column as header
toggleHeader("column", { useSelectedRowColumn: true });
```

</td>
</tr>
</tbody>
</table>
