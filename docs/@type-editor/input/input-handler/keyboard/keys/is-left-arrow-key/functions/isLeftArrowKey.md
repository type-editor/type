[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-left-arrow-key](../README.md) / isLeftArrowKey

# Function: isLeftArrowKey()

```ts
function isLeftArrowKey(key, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-left-arrow-key.ts:12](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/input/src/input-handler/keyboard/keys/is-left-arrow-key.ts#L12)

Checks if the key event represents a left arrow action.

## Parameters

| Parameter    | Type           | Description                                     |
| ------------ | -------------- | ----------------------------------------------- |
| `key`        | `string`       | The key value from the keyboard event           |
| `inputState` | `PmInputState` | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is a left arrow action
