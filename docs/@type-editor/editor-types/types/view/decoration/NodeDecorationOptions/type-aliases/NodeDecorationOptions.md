[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/decoration/NodeDecorationOptions](../README.md) / NodeDecorationOptions

# Type Alias: NodeDecorationOptions

```ts
type NodeDecorationOptions = Record<string, unknown>;
```

Defined in: [packages/editor-types/src/types/view/decoration/NodeDecorationOptions.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/NodeDecorationOptions.ts#L29)

Specs allow arbitrary additional properties for storing custom data.
These properties are preserved when decorations are mapped through
document changes and can be accessed via the decoration's `spec` property.
