[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/is-in-table

# utils/is-in-table

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

[isInTable](functions/isInTable.md)

</td>
<td>

Checks whether the current selection is inside a table.

This function examines the selection's head position and traverses up
the document tree to determine if any ancestor is a table row.

**Example**

```typescript
if (isInTable(state)) {
  // Enable table-specific commands
}
```

</td>
</tr>
</tbody>
</table>
