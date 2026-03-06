[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/decoration/NodeDecorationOptions](../README.md) / NodeDecorationOptions

# Type Alias: NodeDecorationOptions

```ts
type NodeDecorationOptions = Record<string, unknown>;
```

Defined in: [packages/editor-types/src/types/view/decoration/NodeDecorationOptions.ts:29](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/editor-types/src/types/view/decoration/NodeDecorationOptions.ts#L29)

Specs allow arbitrary additional properties for storing custom data.
These properties are preserved when decorations are mapped through
document changes and can be accessed via the decoration's `spec` property.
