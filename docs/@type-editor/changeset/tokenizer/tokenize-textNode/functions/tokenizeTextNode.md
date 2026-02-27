[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [tokenizer/tokenize-textNode](../README.md) / tokenizeTextNode

# Function: tokenizeTextNode()

```ts
function tokenizeTextNode<T>(
  textNode,
  encoder,
  rangeStart,
  rangeEnd,
  nodeOffset,
  target,
): void;
```

Defined in: [tokenizer/tokenize-textNode.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/tokenizer/tokenize-textNode.ts#L16)

Tokenize a text node by encoding each character within the specified range.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter    | Type                                                                                | Description                                             |
| ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `textNode`   | `Node_2`                                                                            | The text node to tokenize.                              |
| `encoder`    | [`TokenEncoder`](../../../types/TokenEncoder/interfaces/TokenEncoder.md)&lt;`T`&gt; | The encoder to use for converting characters to tokens. |
| `rangeStart` | `number`                                                                            | The start position in the document.                     |
| `rangeEnd`   | `number`                                                                            | The end position in the document.                       |
| `nodeOffset` | `number`                                                                            | The offset of this node in the document.                |
| `target`     | `T`[]                                                                               | The array to append tokens to.                          |

## Returns

`void`
