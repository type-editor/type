[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/keyboard/key-press-handler](../README.md) / keyPressHandler

# Function: keyPressHandler()

```ts
function keyPressHandler(view, event): boolean;
```

Defined in: [input-handler/keyboard/key-press-handler.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/keyboard/key-press-handler.ts#L11)

Handles keypress events for character input. Delegates to handleKeyPress
prop or handleTextInput prop, falling back to default text insertion.
Skips handling during composition or for modifier key combinations.

## Parameters

| Parameter | Type            |
| --------- | --------------- |
| `view`    | `PmEditorView`  |
| `event`   | `KeyboardEvent` |

## Returns

`boolean`
