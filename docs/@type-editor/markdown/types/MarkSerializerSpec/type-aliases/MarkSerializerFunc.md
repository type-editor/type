[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/MarkSerializerSpec](../README.md) / MarkSerializerFunc

# Type Alias: MarkSerializerFunc()

```ts
type MarkSerializerFunc = (state, mark, parent, index) => string;
```

Defined in: [types/MarkSerializerSpec.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/types/MarkSerializerSpec.ts#L15)

## Parameters

| Parameter | Type                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `state`   | [`MarkdownSerializerState`](../../../to-markdown/MarkdownSerializerState/classes/MarkdownSerializerState.md) |
| `mark`    | `Mark`                                                                                                       |
| `parent`  | `Node`                                                                                                       |
| `index`   | `number`                                                                                                     |

## Returns

`string`
