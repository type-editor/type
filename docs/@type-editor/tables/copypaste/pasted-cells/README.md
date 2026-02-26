[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / copypaste/pasted-cells

# copypaste/pasted-cells

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

[pastedCells](functions/pastedCells.md)

</td>
<td>

Extracts a rectangular area of cells from a slice.

This function analyzes the content of a slice and, if it contains table cells
or rows, extracts them into a normalized rectangular [Area](../../types/copypaste/Area/interfaces/Area.md) structure.
The function handles partial selections by fitting them into complete rows.

**Example**

```typescript
const slice = view.state.doc.slice(from, to);
const cells = pastedCells(slice);
if (cells) {
  console.log(`Pasted ${cells.width}x${cells.height} cells`);
}
```

</td>
</tr>
</tbody>
</table>
