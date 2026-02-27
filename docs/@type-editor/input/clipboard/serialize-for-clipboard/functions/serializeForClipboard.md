[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/input](../../../README.md) / [clipboard/serialize-for-clipboard](../README.md) / serializeForClipboard

# Function: serializeForClipboard()

```ts
function serializeForClipboard(view, slice): SerializedClipboard;
```

Defined in: [clipboard/serialize-for-clipboard.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/clipboard/serialize-for-clipboard.ts#L21)

Serialize a slice for placing on the clipboard.
Produces a DOM fragmen, t, a plain-text representation, and the (possibly
normalized) slice used.

## Parameters

| Parameter | Type           | Description                                  |
| --------- | -------------- | -------------------------------------------- |
| `view`    | `PmEditorView` | The editor view performing the serialization |
| `slice`   | `Slice`        | The slice to serialize                       |

## Returns

[`SerializedClipboard`](../../../types/clipboard/SerializedClipboard/interfaces/SerializedClipboard.md)

An object with dom (a wrapper div containing HTML), text and slice
