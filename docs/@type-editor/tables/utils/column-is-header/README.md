[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/column-is-header

# utils/column-is-header

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

[columnIsHeader](functions/columnIsHeader.md)

</td>
<td>

Checks if an entire column consists only of header cells.

This function iterates through all rows of the table and checks if
every cell in the specified column is a header cell.

**Example**

```typescript
const map = TableMap.get(tableNode);
if (columnIsHeader(map, tableNode, 0)) {
  console.log("First column is a header column");
}
```

</td>
</tr>
</tbody>
</table>
