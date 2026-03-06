[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/keys/is-right-arrow-key](../README.md) / isRightArrowKey

# Function: isRightArrowKey()

```ts
function isRightArrowKey(key, inputState): boolean;
```

Defined in: [input-handler/keyboard/keys/is-right-arrow-key.ts:13](https://github.com/type-editor/type/blob/aa914636446ba41d4acaa23bd67323cc71b1ac08/packages/input/src/input-handler/keyboard/keys/is-right-arrow-key.ts#L13)

Checks if the key event represents a right arrow action.

## Parameters

| Parameter    | Type           | Description                                     |
| ------------ | -------------- | ----------------------------------------------- |
| `key`        | `string`       | The key value from the keyboard event           |
| `inputState` | `PmInputState` | The input state that contains the modifier keys |

## Returns

`boolean`

True if this is a right arrow action
