[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/NodeSerializerFunc](../README.md) / NodeSerializerFunc

# Type Alias: NodeSerializerFunc()

```ts
type NodeSerializerFunc = (state, node, parent, index) => void;
```

Defined in: [types/NodeSerializerFunc.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/types/NodeSerializerFunc.ts#L14)

A function type for serializing ProseMirror nodes to Markdown.

## Parameters

| Parameter | Type                                                                                                         | Description                              |
| --------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `state`   | [`MarkdownSerializerState`](../../../to-markdown/MarkdownSerializerState/classes/MarkdownSerializerState.md) | The current serializer state             |
| `node`    | `Node`                                                                                                       | The node to serialize                    |
| `parent`  | `Node`                                                                                                       | The parent node containing this node     |
| `index`   | `number`                                                                                                     | The index of this node within its parent |

## Returns

`void`
