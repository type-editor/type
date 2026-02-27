[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/MarkSerializerSpec](../README.md) / MarkSerializerFunc

# Type Alias: MarkSerializerFunc()

```ts
type MarkSerializerFunc = (state, mark, parent, index) => string;
```

Defined in: [types/MarkSerializerSpec.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/types/MarkSerializerSpec.ts#L15)

## Parameters

| Parameter | Type                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `state`   | [`MarkdownSerializerState`](../../../to-markdown/MarkdownSerializerState/classes/MarkdownSerializerState.md) |
| `mark`    | `Mark`                                                                                                       |
| `parent`  | `Node`                                                                                                       |
| `index`   | `number`                                                                                                     |

## Returns

`string`
