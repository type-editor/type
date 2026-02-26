[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / node-size

# node-size

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

[nodeSize](functions/nodeSize.md)

</td>
<td>

Gets the size of a DOM node.

For text nodes (nodeType 3), returns the length of the text content.
For element nodes, returns the number of child nodes.

**Example**

```typescript
const textNode = document.createTextNode("Hello");
const size = nodeSize(textNode); // Returns 5

const element = document.createElement("div");
element.appendChild(document.createElement("span"));
const elemSize = nodeSize(element); // Returns 1
```

</td>
</tr>
</tbody>
</table>
