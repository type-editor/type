[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/gapcursor](../../README.md) / [gap-cursor-plugin](../README.md) / gapCursor

# Function: gapCursor()

```ts
function gapCursor(): Plugin_2;
```

Defined in: [gapcursor/src/gap-cursor-plugin.ts:36](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/gapcursor/src/gap-cursor-plugin.ts#L36)

Creates a gap cursor plugin for the editor.

When enabled, this plugin will:

- Capture clicks near positions that don't have a normally selectable position
- Create gap cursor selections for such positions
- Handle composition input to avoid IME conflicts
- Render the gap cursor with the 'ProseMirror-gapcursor' CSS class

## Returns

`Plugin_2`

A configured Plugin instance.
