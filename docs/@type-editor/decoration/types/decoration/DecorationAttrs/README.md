[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / types/decoration/DecorationAttrs

# types/decoration/DecorationAttrs

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[DecorationAttrs](interfaces/DecorationAttrs.md)

</td>
<td>

A set of attributes to add to a decorated node. Most properties
simply directly correspond to DOM attributes of the same name,
which will be set to the property's value. These are exceptions:

Used with inline and node decorations to specify what attributes
should be applied to the decorated content's DOM representation.

**Example**

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

</td>
</tr>
</tbody>
</table>
