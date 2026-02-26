[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [types/clipboard/SerializationContext](../README.md) / SerializationContext

# Type Alias: SerializationContext

```ts
type SerializationContext = (string | Record<string, unknown> | null)[];
```

Defined in: [types/clipboard/SerializationContext.ts:5](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/types/clipboard/SerializationContext.ts#L5)

Context data stored during serialization to preserve wrapper information.
Stored as an array alternating between node type name and attributes.
