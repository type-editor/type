[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-formatting-shortcut](../README.md) / isFormattingShortcut

# Function: isFormattingShortcut()

```ts
function isFormattingShortcut(key, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-formatting-shortcut.ts:11](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/input-handler/keyboard/keys/is-formatting-shortcut.ts#L11)

Checks if the key combination is a formatting shortcut (Bold, Italic, Undo, Redo).

## Parameters

| Parameter    | Type           | Description                                     |
| ------------ | -------------- | ----------------------------------------------- |
| `key`        | `string`       | The key value from the keyboard event           |
| `inputState` | `PmInputState` | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is a formatting shortcut
