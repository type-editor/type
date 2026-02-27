[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [types/IconSpec](../README.md) / IconSpec

# Type Alias: IconSpec

```ts
type IconSpec =
  | {
      height: number;
      path: string;
      width: number;
    }
  | {
      css?: string;
      text: string;
    }
  | {
      dom: Node;
    };
```

Defined in: [packages/menu/src/types/IconSpec.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/types/IconSpec.ts#L11)

Specifies an icon. May be either an SVG icon, in which case its
`path` property should be an [SVG path
spec](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d),
and `width` and `height` should provide the viewbox in which that
path exists. Alternatively, it may have a `text` property
specifying a string of text that makes up the icon, with an
optional `css` property giving additional CSS styling for the
text. _Or_ it may contain `dom` property containing a DOM node.
