[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/markdown](../../../../README.md) / [from-markdown/schema/markdown-to-pm-nodes-schema](../README.md) / markdownToPmNodesSchema

# Variable: markdownToPmNodesSchema

```ts
const markdownToPmNodesSchema: Record<string, ParseSpec>;
```

Defined in: [from-markdown/schema/markdown-to-pm-nodes-schema.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/from-markdown/schema/markdown-to-pm-nodes-schema.ts#L11)

Parse specification for unextended [CommonMark](http://commonmark.org/),
without inline HTML, producing a document in the basic schema.
Maps markdown-it token types to ProseMirror nodes and marks.
