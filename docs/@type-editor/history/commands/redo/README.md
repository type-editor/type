[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/history](../../README.md) / commands/redo

# commands/redo

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[redo](variables/redo.md)

</td>
<td>

A command function that redoes the last undone change, if any.

This command will redo the most recently undone change in the editor's history
and automatically scroll the selection into view after the redo operation.

**Example**

```typescript
// In a keymap
keymap({
  "Mod-Shift-z": redo,
});
```

</td>
</tr>
</tbody>
</table>
