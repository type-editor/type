[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / is-on-edge

# is-on-edge

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

[isOnEdge](functions/isOnEdge.md)

</td>
<td>

Checks if a position is at the start or end edge of a parent node.

Traverses up the DOM tree from the given position to determine if it represents
the very beginning or end of the parent node's content.

**Example**

```typescript
const textNode = document.createTextNode("Hello");
const parent = textNode.parentNode;
const isEdge = isOnEdge(textNode, 0, parent); // True if at start
```

</td>
</tr>
</tbody>
</table>
