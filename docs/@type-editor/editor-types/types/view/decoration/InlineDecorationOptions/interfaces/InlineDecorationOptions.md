[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/decoration/InlineDecorationOptions](../README.md) / InlineDecorationOptions

# Interface: InlineDecorationOptions

Defined in: [packages/editor-types/src/types/view/decoration/InlineDecorationOptions.ts:26](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/view/decoration/InlineDecorationOptions.ts#L26)

Options for inline decorations that control how the decoration behaves
when the document is edited at its boundaries.

## Example

```typescript
// Non-inclusive decoration (default)
// Typing at boundaries won't include new text
const decoration1 = Decoration.inline(0, 5, { class: "highlight" });

// Fully inclusive decoration
// Typing at either boundary will include new text
const decoration2 = Decoration.inline(
  0,
  5,
  { class: "highlight" },
  { inclusiveStart: true, inclusiveEnd: true },
);

// Start-inclusive only
// Typing at the start includes new text, at the end does not
const decoration3 = Decoration.inline(
  0,
  5,
  { class: "highlight" },
  { inclusiveStart: true },
);
```

## Indexable

```ts
[key: string]: unknown
```

Specs allow arbitrary additional properties for storing custom data.
These properties are preserved when decorations are mapped through
document changes and can be accessed via the decoration's `spec` property.

## Properties

| Property                                               | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Defined in                                                                                                                                                                                                                                        |
| ------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-inclusiveend"></a> `inclusiveEnd?`     | `boolean` | Determines how the right side of the decoration is mapped. See [inclusiveStart](#property-inclusivestart). When `false` (default): Text inserted at the end position will appear after the decoration. When `true`: Text inserted at the end position will be included in the decoration. **Default** `false`                                                                                                                                                      | [packages/editor-types/src/types/view/decoration/InlineDecorationOptions.ts:55](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/view/decoration/InlineDecorationOptions.ts#L55) |
| <a id="property-inclusivestart"></a> `inclusiveStart?` | `boolean` | Determines how the left side of the decoration is [mapped](#transform.Position_Mapping) when content is inserted directly at that position. By default, the decoration won't include the new content, but you can set this to `true` to make it inclusive. When `false` (default): Text inserted at the start position will appear before the decoration. When `true`: Text inserted at the start position will be included in the decoration. **Default** `false` | [packages/editor-types/src/types/view/decoration/InlineDecorationOptions.ts:42](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/view/decoration/InlineDecorationOptions.ts#L42) |
