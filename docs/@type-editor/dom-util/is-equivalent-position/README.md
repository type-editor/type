[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / is-equivalent-position

# is-equivalent-position

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[isEquivalentPosition](functions/isEquivalentPosition.md)

</td>
<td>

Checks if two DOM positions are equivalent.

Scans forward and backward through DOM positions to determine if two positions
refer to the same location in the document. This is useful for handling cases
like a position after a text node vs. at the end of that text node.

**Example**

```typescript
const textNode = document.createTextNode("Hello");
const parent = textNode.parentNode;
// Position after text node vs. at end of text node
const equivalent = isEquivalentPosition(parent, 1, textNode, 5);
```

</td>
</tr>
</tbody>
</table>
