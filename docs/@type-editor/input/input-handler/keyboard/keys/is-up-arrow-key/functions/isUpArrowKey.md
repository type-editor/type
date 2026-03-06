[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-up-arrow-key](../README.md) / isUpArrowKey

# Function: isUpArrowKey()

```ts
function isUpArrowKey(key, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-up-arrow-key.ts:13](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/input/src/input-handler/keyboard/keys/is-up-arrow-key.ts#L13)

Checks if the key event represents an up arrow action.

## Parameters

| Parameter    | Type           | Description                                     |
| ------------ | -------------- | ----------------------------------------------- |
| `key`        | `string`       | The key value from the keyboard event           |
| `inputState` | `PmInputState` | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is an up arrow action
