[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / cellselection/CellSelection

# cellselection/CellSelection

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

[CellSelection](classes/CellSelection.md)

</td>
<td>

A Selection subclass that represents a cell selection spanning part of a table.
With the plugin enabled, these will be created when the user selects across cells,
and will be drawn by giving selected cells a `selectedCell` CSS class.

**See**

[Selection](https://prosemirror.net/docs/ref/#state.Selection|ProseMirror)

**Example**

```typescript
// Create a single cell selection
const selection = new CellSelection($cellPos);

// Create a multi-cell selection
const selection = new CellSelection($anchorCell, $headCell);

// Create a full column selection
const colSel = CellSelection.colSelection($anchorCell, $headCell);
```

</td>
</tr>
</tbody>
</table>
