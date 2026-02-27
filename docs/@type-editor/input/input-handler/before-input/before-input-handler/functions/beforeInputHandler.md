[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/before-input/before-input-handler](../README.md) / beforeInputHandler

# Function: beforeInputHandler()

```ts
function beforeInputHandler(view, event): boolean;
```

Defined in: [input-handler/before-input/before-input-handler.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/input/src/input-handler/before-input/before-input-handler.ts#L14)

Handles beforeinput events. Currently only used for a Chrome Android
workaround where backspace sometimes fails after uneditable nodes.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `InputEvent`   |

## Returns

`boolean`
