[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/schema/AttrsObject](../README.md) / AttrsObject

# Type Alias: AttrsObject

```ts
type AttrsObject = Record<string, string | number | boolean | null | undefined>;
```

Defined in: [packages/model/src/types/schema/AttrsObject.ts:5](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/model/src/types/schema/AttrsObject.ts#L5)

A mutable object holding the attributes of a node or mark. Unlike `Attrs`,
this type allows modification of attribute values.
