[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/input](../../../README.md) / [clipboard/parse-from-clipboard](../README.md) / parseFromClipboard

# Function: parseFromClipboard()

```ts
function parseFromClipboard(view, text, html, plainText, $context): Slice;
```

Defined in: [clipboard/parse-from-clipboard.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/input/src/clipboard/parse-from-clipboard.ts#L29)

Read a slice from clipboard data (text and/or html).
Handles plaintext, html, and various ProseMirror-specific clipboard markers.

## Parameters

| Parameter   | Type           | Description                                                  |
| ----------- | -------------- | ------------------------------------------------------------ |
| `view`      | `PmEditorView` | The editor view                                              |
| `text`      | `string`       | Plain text from the clipboard (may be empty)                 |
| `html`      | `string`       | HTML from the clipboard (may be null)                        |
| `plainText` | `boolean`      | Whether the source explicitly requested plain text handling  |
| `$context`  | `ResolvedPos`  | The resolved position representing current selection context |

## Returns

`Slice`

A Slice to be inserted or null when nothing available
