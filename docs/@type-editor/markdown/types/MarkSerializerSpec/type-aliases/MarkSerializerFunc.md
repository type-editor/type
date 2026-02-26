[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/MarkSerializerSpec](../README.md) / MarkSerializerFunc

# Type Alias: MarkSerializerFunc()

```ts
type MarkSerializerFunc = (state, mark, parent, index) => string;
```

Defined in: [types/MarkSerializerSpec.ts:15](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/types/MarkSerializerSpec.ts#L15)

## Parameters

| Parameter | Type                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `state`   | [`MarkdownSerializerState`](../../../to-markdown/MarkdownSerializerState/classes/MarkdownSerializerState.md) |
| `mark`    | `Mark`                                                                                                       |
| `parent`  | `Node`                                                                                                       |
| `index`   | `number`                                                                                                     |

## Returns

`string`
