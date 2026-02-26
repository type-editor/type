[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / has-block-desc

# has-block-desc

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

[hasBlockDesc](functions/hasBlockDesc.md)

</td>
<td>

Checks if a DOM node has a block-level ViewDesc associated with it.

Traverses up the DOM tree to find a ViewDesc, then checks if it represents
a block node and if the original DOM node is either the main DOM or content DOM
of that ViewDesc.

**Example**

```typescript
const paragraph = document.querySelector("p");
const isBlock = hasBlockDesc(paragraph);
```

</td>
</tr>
</tbody>
</table>
