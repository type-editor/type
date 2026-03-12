[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/keyboard/key-down-handler](../README.md) / captureKeyDown

# Function: captureKeyDown()

```ts
function captureKeyDown(view, event): boolean;
```

Defined in: [input-handler/keyboard/key-down-handler.ts:123](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/keyboard/key-down-handler.ts#L123)

Captures and handles key down events in the editor, intercepting certain key combinations
to provide custom behavior for navigation, deletion, and selection operations.

This function acts as the main entry point for keyboard event handling, delegating to
specialized functions based on the key pressed and active modifiers.

## Parameters

| Parameter | Type            | Description                  |
| --------- | --------------- | ---------------------------- |
| `view`    | `PmEditorView`  | The EditorView instance      |
| `event`   | `KeyboardEvent` | The keyboard event to handle |

## Returns

`boolean`

True if the event was handled and should be prevented from default behavior
