[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/decoration](../../../../README.md) / [types/decoration/DecorationAttrs](../README.md) / DecorationAttrs

# Interface: DecorationAttrs

Defined in: [types/decoration/DecorationAttrs.ts:32](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/types/decoration/DecorationAttrs.ts#L32)

A set of attributes to add to a decorated node. Most properties
simply directly correspond to DOM attributes of the same name,
which will be set to the property's value. These are exceptions:

Used with inline and node decorations to specify what attributes
should be applied to the decorated content's DOM representation.

## Example

```typescript
// Simple class and style
const attrs: DecorationAttrs = {
  class: "highlight selected",
  style: "background-color: yellow; font-weight: bold",
};

// Using a custom wrapper element
const attrs2: DecorationAttrs = {
  nodeName: "mark",
  class: "search-result",
  "data-result-id": "result-123",
};

// Data attributes and ARIA
const attrs3: DecorationAttrs = {
  "data-user": "john",
  "data-color": "blue",
  "aria-label": "Collaborative cursor",
};
```

## Indexable

```ts
[attribute: string]: string
```

Any other properties are treated as regular DOM attributes.

This allows you to set any valid HTML attribute, including:

- Data attributes: `data-*`
- ARIA attributes: `aria-*`
- Standard HTML attributes: `title`, `id`, etc.

## Properties

| Property                                   | Type     | Description                                                                                                                                                                                                                                                  | Defined in                                                                                                                                                                                  |
| ------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-class"></a> `class?`       | `string` | A CSS class name or a space-separated set of class names to be _added_ to the classes that the node already had. Multiple classes can be specified separated by spaces. These classes are added to any existing classes, not replacing them.                 | [types/decoration/DecorationAttrs.ts:49](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/types/decoration/DecorationAttrs.ts#L49) |
| <a id="property-nodename"></a> `nodeName?` | `string` | When non-null, the target node is wrapped in a DOM element of this type (and the other attributes are applied to this element). For inline decorations, this defaults to "span" if not specified. Common values include "span", "mark", "em", "strong", etc. | [types/decoration/DecorationAttrs.ts:40](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/types/decoration/DecorationAttrs.ts#L40) |
| <a id="property-style"></a> `style?`       | `string` | A string of CSS to be _added_ to the node's existing `style` property. Should be a valid CSS property declaration string. This is added to any existing inline styles, not replacing them. **Example** `"background-color: yellow; border: 1px solid red"`   | [types/decoration/DecorationAttrs.ts:59](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/types/decoration/DecorationAttrs.ts#L59) |
