[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / tableview/TableView

# tableview/TableView

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[TableView](classes/TableView.md)

</td>
<td>

Custom NodeView implementation for rendering table nodes with column resizing support.

This view creates a wrapper `<div>` containing a `<table>` element with a `<colgroup>`
for column width management and a `<tbody>` for the actual table content. The column
widths are synchronized with the document's column width attributes.

**Example**

```typescript
const tableView = new TableView(tableNode, 100);
// tableView.dom returns the wrapper div
// tableView.contentDOM returns the tbody where content is rendered
```

</td>
</tr>
</tbody>
</table>
