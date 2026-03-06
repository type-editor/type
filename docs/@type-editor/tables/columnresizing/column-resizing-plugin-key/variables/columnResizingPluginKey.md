[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [columnresizing/column-resizing-plugin-key](../README.md) / columnResizingPluginKey

# Variable: columnResizingPluginKey

```ts
const columnResizingPluginKey: PluginKey<ResizeState>;
```

Defined in: [tables/src/columnresizing/column-resizing-plugin-key.ts:17](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/columnresizing/column-resizing-plugin-key.ts#L17)

Plugin key for accessing the column resizing plugin state.
Use this key to retrieve the current [ResizeState](../../ResizeState/classes/ResizeState.md) from the editor state.

## Example

```typescript
const resizeState = columnResizingPluginKey.getState(editorState);
if (resizeState?.dragging) {
  // Handle active drag operation
}
```
