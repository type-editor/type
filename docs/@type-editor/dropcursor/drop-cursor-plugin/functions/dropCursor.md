[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dropcursor](../../README.md) / [drop-cursor-plugin](../README.md) / dropCursor

# Function: dropCursor()

```ts
function dropCursor(options?): Plugin_2;
```

Defined in: [drop-cursor-plugin.ts:35](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dropcursor/src/drop-cursor-plugin.ts#L35)

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

## Parameters

| Parameter | Type                                                                                 | Description                                                       |
| --------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `options` | [`DropCursorOptions`](../../types/DropCursorOptions/interfaces/DropCursorOptions.md) | Configuration options for the drop cursor appearance and behavior |

## Returns

`Plugin_2`

A ProseMirror plugin instance
