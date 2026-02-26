[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/history](../../README.md) / helper/undo-depth

# helper/undo-depth

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

[undoDepth](functions/undoDepth.md)

</td>
<td>

Returns the number of undoable events available in the editor's history.

This can be used to determine whether the undo command is available,
or to display the undo history depth in the UI.

**Example**

```typescript
const canUndo = undoDepth(state) > 0;
console.log(`You can undo ${undoDepth(state)} changes`);
```

</td>
</tr>
</tbody>
</table>
