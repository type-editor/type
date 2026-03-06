[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/before-input/before-input-handler](../README.md) / beforeInputHandler

# Function: beforeInputHandler()

```ts
function beforeInputHandler(view, event): boolean;
```

Defined in: [input-handler/before-input/before-input-handler.ts:14](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/input-handler/before-input/before-input-handler.ts#L14)

Handles beforeinput events. Currently only used for a Chrome Android
workaround where backspace sometimes fails after uneditable nodes.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `InputEvent`   |

## Returns

`boolean`
