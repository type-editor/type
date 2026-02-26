[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/markdown](../../../../README.md) / [to-markdown/schema/markdown-schema-nodes](../README.md) / markdownSchemaNodes

# Variable: markdownSchemaNodes

```ts
const markdownSchemaNodes: {
  blockquote: void;
  bullet_list: void;
  code_block: void;
  hard_break: void;
  heading: void;
  horizontal_rule: void;
  image: void;
  list_item: void;
  ordered_list: void;
  paragraph: void;
  text: void;
};
```

Defined in: [to-markdown/schema/markdown-schema-nodes.ts:6](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L6)

## Type Declaration

| Name                | Type                                            | Defined in                                                                                                                                                                                                |
| ------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blockquote()`      | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:8](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L8)   |
| `bullet_list()`     | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:43](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L43) |
| `code_block()`      | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L14) |
| `hard_break()`      | ( `state`, `node`, `parent`, `index`) => `void` | [to-markdown/schema/markdown-schema-nodes.ts:74](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L74) |
| `heading()`         | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:32](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L32) |
| `horizontal_rule()` | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:38](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L38) |
| `image()`           | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:68](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L68) |
| `list_item()`       | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:59](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L59) |
| `ordered_list()`    | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:47](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L47) |
| `paragraph()`       | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:63](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L63) |
| `text()`            | (`state`, `node`) => `void`                     | [to-markdown/schema/markdown-schema-nodes.ts:84](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/to-markdown/schema/markdown-schema-nodes.ts#L84) |
