[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/copy-paste/paste-handler](../README.md) / pasteHandler

# Function: pasteHandler()

```ts
function pasteHandler(view, event): boolean;
```

Defined in: [input-handler/copy-paste/paste-handler.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/input-handler/copy-paste/paste-handler.ts#L14)

Handles paste events. During composition (except on Android), defers to
browser's native handling. Otherwise, extracts clipboard data and processes it.

## Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `view`    | `PmEditorView`   |
| `event`   | `ClipboardEvent` |

## Returns

`boolean`
