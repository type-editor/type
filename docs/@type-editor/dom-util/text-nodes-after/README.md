[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / text-nodes-after

# text-nodes-after

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

[textNodeAfter](functions/textNodeAfter.md)

</td>
<td>

Finds the text node after a given position in the DOM tree.

Traverses the DOM tree forward from the given position to find the nearest
following text node. Stops at non-editable elements and block boundaries.

**Example**

```typescript
const element = document.getElementById("myElement");
const textNode = textNodeAfter(element, 0);
```

</td>
</tr>
</tbody>
</table>
