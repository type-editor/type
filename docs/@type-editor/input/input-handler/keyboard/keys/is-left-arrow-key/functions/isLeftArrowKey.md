[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-left-arrow-key](../README.md) / isLeftArrowKey

# Function: isLeftArrowKey()

```ts
function isLeftArrowKey(key, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-left-arrow-key.ts:12](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/input/src/input-handler/keyboard/keys/is-left-arrow-key.ts#L12)

Checks if the key event represents a left arrow action.

## Parameters

| Parameter    | Type           | Description                                     |
| ------------ | -------------- | ----------------------------------------------- |
| `key`        | `string`       | The key value from the keyboard event           |
| `inputState` | `PmInputState` | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is a left arrow action
