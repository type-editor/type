[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dropcursor](../README.md) / drop-cursor-plugin

# drop-cursor-plugin

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

[dropCursor](functions/dropCursor.md)

</td>
<td>

Creates a plugin that displays a visual drop cursor indicator when content is dragged over the editor.

The drop cursor helps users see where dragged content will be inserted. It appears as a colored line
or block at the potential drop position during drag-and-drop operations.

## Usage Example

```typescript
const editor = new EditorView({
  state: EditorState.create({
    plugins: [dropCursor({ color: "blue", width: 2 })],
  }),
});
```

## Node Spec Integration

Nodes may add a `disableDropCursor` property to their spec to control whether the drop cursor
can appear inside them. This can be:

- A boolean: `true` to disable, `false` to enable
- A function: `(view, pos, event) => boolean` for dynamic control

</td>
</tr>
</tbody>
</table>
