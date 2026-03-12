[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/copy-paste/copy-handler](../README.md) / copyHandler

# Function: copyHandler()

```ts
function copyHandler(view, event): boolean;
```

Defined in: [input-handler/copy-paste/copy-handler.ts:15](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/copy-paste/copy-handler.ts#L15)

Handles copy and cut events. Serializes the selected content and puts
it on the clipboard. For cut events, also deletes the selection.

## Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `view`    | `PmEditorView`   |
| `event`   | `ClipboardEvent` |

## Returns

`boolean`
