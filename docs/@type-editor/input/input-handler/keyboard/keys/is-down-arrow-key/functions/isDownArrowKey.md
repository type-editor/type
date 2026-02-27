[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-down-arrow-key](../README.md) / isDownArrowKey

# Function: isDownArrowKey()

```ts
function isDownArrowKey(key, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-down-arrow-key.ts:13](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/input-handler/keyboard/keys/is-down-arrow-key.ts#L13)

Checks if the key event represents a down arrow action.

## Parameters

| Parameter    | Type           | Description                                     |
| ------------ | -------------- | ----------------------------------------------- |
| `key`        | `string`       | The key value from the keyboard event           |
| `inputState` | `PmInputState` | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is a down arrow action
