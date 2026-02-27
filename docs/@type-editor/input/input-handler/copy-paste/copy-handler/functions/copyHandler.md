[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/copy-paste/copy-handler](../README.md) / copyHandler

# Function: copyHandler()

```ts
function copyHandler(view, event): boolean;
```

Defined in: [input-handler/copy-paste/copy-handler.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/input/src/input-handler/copy-paste/copy-handler.ts#L15)

Handles copy and cut events. Serializes the selected content and puts
it on the clipboard. For cut events, also deletes the selection.

## Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `view`    | `PmEditorView`   |
| `event`   | `ClipboardEvent` |

## Returns

`boolean`
