[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/gapcursor](../../README.md) / [gap-cursor-plugin](../README.md) / gapCursor

# Function: gapCursor()

```ts
function gapCursor(): PmPlugin;
```

Defined in: [gapcursor/src/gap-cursor-plugin.ts:37](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/gapcursor/src/gap-cursor-plugin.ts#L37)

Creates a gap cursor plugin for the editor.

When enabled, this plugin will:

- Capture clicks near positions that don't have a normally selectable position
- Create gap cursor selections for such positions
- Handle composition input to avoid IME conflicts
- Render the gap cursor with the 'ProseMirror-gapcursor' CSS class

## Returns

`PmPlugin`

A configured Plugin instance.
