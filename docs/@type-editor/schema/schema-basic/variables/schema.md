[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/schema](../../README.md) / [schema-basic](../README.md) / schema

# Variable: schema

```ts
const schema: Schema;
```

Defined in: [schema-basic.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/schema/src/schema-basic.ts#L19)

This schema roughly corresponds to the document schema used by
[CommonMark](http://commonmark.org/), minus the list elements,
which are defined in the [`prosemirror-schema-list`](#schema-list)
module.

To reuse elements from this schema, extend or read from its
`spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
