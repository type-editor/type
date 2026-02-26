[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/history](../../README.md) / helper/redo-depth

# helper/redo-depth

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

[redoDepth](functions/redoDepth.md)

</td>
<td>

Returns the number of redoable events available in the editor's history.

This can be used to determine whether the redo command is available,
or to display the redo history depth in the UI.

**Example**

```typescript
const canRedo = redoDepth(state) > 0;
console.log(`You can redo ${redoDepth(state)} changes`);
```

</td>
</tr>
</tbody>
</table>
