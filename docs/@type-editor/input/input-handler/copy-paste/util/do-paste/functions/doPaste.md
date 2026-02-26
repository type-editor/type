[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/copy-paste/util/do-paste](../README.md) / doPaste

# Function: doPaste()

```ts
function doPaste(view, text, html, preferPlain, event): boolean;
```

Defined in: [input-handler/copy-paste/util/do-paste.ts:18](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/copy-paste/util/do-paste.ts#L18)

Processes pasted content, parsing it and inserting it into the editor.
Delegates to handlePaste prop if available, otherwise inserts the content.

## Parameters

| Parameter     | Type             | Description                                |
| ------------- | ---------------- | ------------------------------------------ |
| `view`        | `PmEditorView`   | The editor view                            |
| `text`        | `string`         | Plain text from clipboard                  |
| `html`        | `string`         | HTML content from clipboard (if available) |
| `preferPlain` | `boolean`        | Whether to prefer plain text over HTML     |
| `event`       | `ClipboardEvent` | The paste event                            |

## Returns

`boolean`

True if the paste was handled
