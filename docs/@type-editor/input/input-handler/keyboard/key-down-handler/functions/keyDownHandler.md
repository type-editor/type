[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/keyboard/key-down-handler](../README.md) / keyDownHandler

# Function: keyDownHandler()

```ts
function keyDownHandler(view, event): boolean;
```

Defined in: [input-handler/keyboard/key-down-handler.ts:49](https://github.com/type-editor/type/blob/4813813a587dda7eec62dd72332119887ded8d65/packages/input/src/input-handler/keyboard/key-down-handler.ts#L49)

Handles keydown events in the editor. Manages composition state, platform-specific
quirks (iOS Enter handling, Chrome Android composition), and delegates to custom
handlers or built-in command handlers.

## Parameters

| Parameter | Type            |
| --------- | --------------- |
| `view`    | `PmEditorView`  |
| `event`   | `KeyboardEvent` |

## Returns

`boolean`
