[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/copy-paste/util/capture-paste](../README.md) / capturePaste

# Function: capturePaste()

```ts
function capturePaste(view, event): void;
```

Defined in: [input-handler/copy-paste/util/capture-paste.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/input-handler/copy-paste/util/capture-paste.ts#L17)

Fallback paste mechanism for browsers with broken clipboard APIs.
Creates a temporary off-screen element, focuses it to receive the paste,
then processes the pasted content.

## Parameters

| Parameter | Type             | Description     |
| --------- | ---------------- | --------------- |
| `view`    | `PmEditorView`   | The editor view |
| `event`   | `ClipboardEvent` | The paste event |

## Returns

`void`
