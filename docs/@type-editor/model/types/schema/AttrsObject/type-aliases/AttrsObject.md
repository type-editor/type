[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/schema/AttrsObject](../README.md) / AttrsObject

# Type Alias: AttrsObject

```ts
type AttrsObject = Record<string, string | number | boolean | null | undefined>;
```

Defined in: [packages/model/src/types/schema/AttrsObject.ts:5](https://github.com/type-editor/type/blob/aa914636446ba41d4acaa23bd67323cc71b1ac08/packages/model/src/types/schema/AttrsObject.ts#L5)

A mutable object holding the attributes of a node or mark. Unlike `Attrs`,
this type allows modification of attribute values.
