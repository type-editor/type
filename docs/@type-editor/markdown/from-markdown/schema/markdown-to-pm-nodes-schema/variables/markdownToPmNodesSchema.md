[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/markdown](../../../../README.md) / [from-markdown/schema/markdown-to-pm-nodes-schema](../README.md) / markdownToPmNodesSchema

# Variable: markdownToPmNodesSchema

```ts
const markdownToPmNodesSchema: Record<string, ParseSpec>;
```

Defined in: [from-markdown/schema/markdown-to-pm-nodes-schema.ts:11](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/from-markdown/schema/markdown-to-pm-nodes-schema.ts#L11)

Parse specification for unextended [CommonMark](http://commonmark.org/),
without inline HTML, producing a document in the basic schema.
Maps markdown-it token types to ProseMirror nodes and marks.
