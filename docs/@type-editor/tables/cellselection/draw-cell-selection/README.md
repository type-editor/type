[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / cellselection/draw-cell-selection

# cellselection/draw-cell-selection

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

[drawCellSelection](functions/drawCellSelection.md)

</td>
<td>

Creates decorations to visually highlight selected cells in the editor.

This function is typically used as part of a ProseMirror plugin's decorations
to apply the 'selectedCell' CSS class to all cells within a CellSelection.

**Example**

```typescript
// In a plugin's props.decorations:
decorations: (state) => drawCellSelection(state);
```

</td>
</tr>
</tbody>
</table>
