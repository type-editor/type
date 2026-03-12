[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [tokenizer/tokenize-block-node](../README.md) / tokenizeBlockNode

# Function: tokenizeBlockNode()

```ts
function tokenizeBlockNode<T>(
  blockNode,
  encoder,
  rangeStart,
  rangeEnd,
  nodeOffset,
  nodeEndOffset,
  target,
): void;
```

Defined in: [tokenizer/tokenize-block-node.ts:19](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/changeset/src/tokenizer/tokenize-block-node.ts#L19)

Tokenize a block (non-leaf) node by encoding its boundaries and recursively
tokenizing its content.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter       | Type                                                                                | Description                                        |
| --------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| `blockNode`     | `Node_2`                                                                            | The block node to tokenize.                        |
| `encoder`       | [`TokenEncoder`](../../../types/TokenEncoder/interfaces/TokenEncoder.md)&lt;`T`&gt; | The encoder to use for converting nodes to tokens. |
| `rangeStart`    | `number`                                                                            | The start position in the document.                |
| `rangeEnd`      | `number`                                                                            | The end position in the document.                  |
| `nodeOffset`    | `number`                                                                            | The offset of this node in the document.           |
| `nodeEndOffset` | `number`                                                                            | The end offset of this node in the document.       |
| `target`        | `T`[]                                                                               | The array to append tokens to.                     |

## Returns

`void`
