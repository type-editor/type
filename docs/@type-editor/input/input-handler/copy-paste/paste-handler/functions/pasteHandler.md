[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/copy-paste/paste-handler](../README.md) / pasteHandler

# Function: pasteHandler()

```ts
function pasteHandler(view, event): boolean;
```

Defined in: [input-handler/copy-paste/paste-handler.ts:14](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/input-handler/copy-paste/paste-handler.ts#L14)

Handles paste events. During composition (except on Android), defers to
browser's native handling. Otherwise, extracts clipboard data and processes it.

## Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `view`    | `PmEditorView`   |
| `event`   | `ClipboardEvent` |

## Returns

`boolean`
