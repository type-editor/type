[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/before-input/before-input-handler](../README.md) / beforeInputHandler

# Function: beforeInputHandler()

```ts
function beforeInputHandler(view, event): boolean;
```

Defined in: [input-handler/before-input/before-input-handler.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/input-handler/before-input/before-input-handler.ts#L14)

Handles beforeinput events. Currently only used for a Chrome Android
workaround where backspace sometimes fails after uneditable nodes.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `InputEvent`   |

## Returns

`boolean`
