[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/history](../../README.md) / commands/undo

# commands/undo

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

[undo](variables/undo.md)

</td>
<td>

A command function that undoes the last change, if any.

This command will undo the most recent change in the editor's history and
automatically scroll the selection into view after the undo operation.

**Example**

```typescript
// In a keymap
keymap({
  "Mod-z": undo,
});
```

</td>
</tr>
</tbody>
</table>
