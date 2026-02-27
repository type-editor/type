[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/unwrap-serialized-dom](../README.md) / unwrapSerializedDOM

# Function: unwrapSerializedDOM()

```ts
function unwrapSerializedDOM(dom, wrapperCount): HTMLElement;
```

Defined in: [clipboard/parse/unwrap-serialized-dom.ts:11](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/clipboard/parse/unwrap-serialized-dom.ts#L11)

Unwrap serialized DOM by removing the specified number of wrapper layers.
This reverses the wrapping applied during serialization.

## Parameters

| Parameter      | Type          | Description                        |
| -------------- | ------------- | ---------------------------------- |
| `dom`          | `HTMLElement` | The DOM element to unwrap          |
| `wrapperCount` | `number`      | Number of wrapper layers to remove |

## Returns

`HTMLElement`

The unwrapped DOM element
