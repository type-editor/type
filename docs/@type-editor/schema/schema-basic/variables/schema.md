[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/schema](../../README.md) / [schema-basic](../README.md) / schema

# Variable: schema

```ts
const schema: Schema;
```

Defined in: [schema-basic.ts:19](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/schema/src/schema-basic.ts#L19)

This schema roughly corresponds to the document schema used by
[CommonMark](http://commonmark.org/), minus the list elements,
which are defined in the [`prosemirror-schema-list`](#schema-list)
module.

To reuse elements from this schema, extend or read from its
`spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
