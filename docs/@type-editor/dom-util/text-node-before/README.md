[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / text-node-before

# text-node-before

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

[textNodeBefore](functions/textNodeBefore.md)

</td>
<td>

Finds the text node before a given position in the DOM tree.

Traverses the DOM tree backward from the given position to find the nearest
preceding text node. Stops at non-editable elements and block boundaries.

**Example**

```typescript
const element = document.getElementById("myElement");
const textNode = textNodeBefore(element, 1);
```

</td>
</tr>
</tbody>
</table>
