[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/schema](../../README.md) / [schema-list](../README.md) / orderedList

# Variable: orderedList

```ts
const orderedList: NodeSpec;
```

Defined in: [schema-list.ts:10](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/schema/src/schema-list.ts#L10)

An ordered list [node spec](#model.NodeSpec). Has a single
attribute, `order`, which determines the number at which the list
starts counting, and defaults to 1. Represented as an `<ol>`
element.
