[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/col-count

# utils/col-count

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

[colCount](functions/colCount.md)

</td>
<td>

Gets the column index of the cell at the given position.

For cells that span multiple columns, this returns the index of the
leftmost column the cell occupies.

**Example**

```typescript
const column = colCount($cellPos);
console.log(`Cell is in column ${column}`);
```

</td>
</tr>
</tbody>
</table>
