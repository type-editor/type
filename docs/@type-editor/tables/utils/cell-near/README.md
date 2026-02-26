[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/cell-near

# utils/cell-near

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

[cellNear](functions/cellNear.md)

</td>
<td>

Finds a cell near the given position by traversing adjacent nodes.

This function first looks forward through nodeAfter and its first children,
then looks backward through nodeBefore and its last children. This is useful
when the position is at a table boundary rather than inside a cell.

**Example**

```typescript
const $cell = cellNear($pos);
if ($cell) {
  console.log("Found cell near position");
}
```

</td>
</tr>
</tbody>
</table>
