[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-backspace-key](../README.md) / isBackspaceKey

# Function: isBackspaceKey()

```ts
function isBackspaceKey(key, _event, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-backspace-key.ts:14](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/input-handler/keyboard/keys/is-backspace-key.ts#L14)

Checks if the key event represents a backspace action.

## Parameters

| Parameter    | Type            | Description                                     |
| ------------ | --------------- | ----------------------------------------------- |
| `key`        | `string`        | The key value from the keyboard event           |
| `_event`     | `KeyboardEvent` | The full keyboard event                         |
| `inputState` | `PmInputState`  | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is a backspace action
