[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-util](../README.md) / text-range

# text-range

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

[clearReusedRange](functions/clearReusedRange.md)

</td>
<td>

Clears the reused Range object.

This should be called when you need to ensure the cached Range is properly released,
particularly when switching contexts or cleaning up resources.

**Example**

```typescript
const range = textRange(textNode, 0, 5);
// ... use range ...
clearReusedRange(); // Clean up when done
```

</td>
</tr>
<tr>
<td>

[textRange](functions/textRange.md)

</td>
<td>

Creates or reuses a DOM Range for a text node.

Note: This function always returns the same Range object for performance reasons.
DOM Range objects are expensive to create and can slow down subsequent DOM updates.
Call `clearReusedRange()` if you need to ensure the range is properly released.

**Example**

```typescript
const textNode = document.createTextNode("Hello World");
const range = textRange(textNode, 0, 5); // Selects "Hello"
```

</td>
</tr>
</tbody>
</table>
