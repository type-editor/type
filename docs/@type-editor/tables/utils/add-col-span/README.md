[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/add-col-span

# utils/add-col-span

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

[addColSpan](functions/addColSpan.md)

</td>
<td>

Creates new cell attributes with increased colspan.

Adds the specified number of columns to the cell's span,
inserting zeros at the specified position in the colwidth array
if it exists.

**Example**

```typescript
const attrs = { colspan: 2, rowspan: 1, colwidth: [100, 200] };
const newAttrs = addColSpan(attrs, 1, 1);
// newAttrs = { colspan: 3, rowspan: 1, colwidth: [100, 0, 200] }
```

</td>
</tr>
</tbody>
</table>
