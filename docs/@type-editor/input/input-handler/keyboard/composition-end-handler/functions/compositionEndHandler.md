[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/keyboard/composition-end-handler](../README.md) / compositionEndHandler

# Function: compositionEndHandler()

```ts
function compositionEndHandler(view, event): boolean;
```

Defined in: [input-handler/keyboard/composition-end-handler.ts:10](https://github.com/type-editor/type/blob/4813813a587dda7eec62dd72332119887ded8d65/packages/input/src/input-handler/keyboard/composition-end-handler.ts#L10)

Handles compositionend events from IME input. Marks the composition as ended
and schedules processing of any pending DOM changes.

## Parameters

| Parameter | Type            |
| --------- | --------------- |
| `view`    | `PmEditorView`  |
| `event`   | `KeyboardEvent` |

## Returns

`boolean`
