[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/decoration/NodeDecorationOptions](../README.md) / NodeDecorationOptions

# Type Alias: NodeDecorationOptions

```ts
type NodeDecorationOptions = Record<string, unknown>;
```

Defined in: [packages/editor-types/src/types/view/decoration/NodeDecorationOptions.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/decoration/NodeDecorationOptions.ts#L29)

Specs allow arbitrary additional properties for storing custom data.
These properties are preserved when decorations are mapped through
document changes and can be accessed via the decoration's `spec` property.
