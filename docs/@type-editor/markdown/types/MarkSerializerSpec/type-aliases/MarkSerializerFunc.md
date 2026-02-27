[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/MarkSerializerSpec](../README.md) / MarkSerializerFunc

# Type Alias: MarkSerializerFunc()

```ts
type MarkSerializerFunc = (state, mark, parent, index) => string;
```

Defined in: [types/MarkSerializerSpec.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/types/MarkSerializerSpec.ts#L15)

## Parameters

| Parameter | Type                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `state`   | [`MarkdownSerializerState`](../../../to-markdown/MarkdownSerializerState/classes/MarkdownSerializerState.md) |
| `mark`    | `Mark`                                                                                                       |
| `parent`  | `Node`                                                                                                       |
| `index`   | `number`                                                                                                     |

## Returns

`string`
