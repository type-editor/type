[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/copy-paste/paste-handler](../README.md) / pasteHandler

# Function: pasteHandler()

```ts
function pasteHandler(view, event): boolean;
```

Defined in: [input-handler/copy-paste/paste-handler.ts:14](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/copy-paste/paste-handler.ts#L14)

Handles paste events. During composition (except on Android), defers to
browser's native handling. Otherwise, extracts clipboard data and processes it.

## Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `view`    | `PmEditorView`   |
| `event`   | `ClipboardEvent` |

## Returns

`boolean`
