[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/remove-col-span

# utils/remove-col-span

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

[removeColSpan](functions/removeColSpan.md)

</td>
<td>

Creates new cell attributes with reduced colspan.

Removes the specified number of columns from the cell's span,
updating the colwidth array accordingly. If all remaining column
widths are zero, the colwidth is set to null.

**Example**

```typescript
const attrs = { colspan: 3, rowspan: 1, colwidth: [100, 200, 300] };
const newAttrs = removeColSpan(attrs, 1, 1);
// newAttrs = { colspan: 2, rowspan: 1, colwidth: [100, 300] }
```

</td>
</tr>
</tbody>
</table>
