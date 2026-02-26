[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / input/handle-triple-click

# input/handle-triple-click

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

[handleTripleClick](functions/handleTripleClick.md)

</td>
<td>

Handles triple-click events to select an entire table cell.

When the user triple-clicks inside a table cell, this selects the entire cell
by creating a [CellSelection](../../cellselection/CellSelection/classes/CellSelection.md) for that cell.

**Example**

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handleTripleClick: handleTripleClick,
  },
});
```

</td>
</tr>
</tbody>
</table>
