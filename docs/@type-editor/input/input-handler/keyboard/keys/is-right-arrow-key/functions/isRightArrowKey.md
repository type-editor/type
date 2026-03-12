[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-right-arrow-key](../README.md) / isRightArrowKey

# Function: isRightArrowKey()

```ts
function isRightArrowKey(key, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-right-arrow-key.ts:13](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/keyboard/keys/is-right-arrow-key.ts#L13)

Checks if the key event represents a right arrow action.

## Parameters

| Parameter    | Type           | Description                                     |
| ------------ | -------------- | ----------------------------------------------- |
| `key`        | `string`       | The key value from the keyboard event           |
| `inputState` | `PmInputState` | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is a right arrow action
