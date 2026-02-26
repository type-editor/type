[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / parent-node

# parent-node

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

[parentNode](functions/parentNode.md)

</td>
<td>

Gets the parent node of a DOM node, accounting for Shadow DOM and slot assignments.

This function handles special cases:

- If the node is slotted, returns the assigned slot
- If the parent is a DocumentFragment (nodeType 11), returns the shadow root host
- Otherwise returns the regular parent node

**Example**

```typescript
const element = document.getElementById("myElement");
const parent = parentNode(element);
```

</td>
</tr>
</tbody>
</table>
