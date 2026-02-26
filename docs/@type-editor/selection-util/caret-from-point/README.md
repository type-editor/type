[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/selection-util](../README.md) / caret-from-point

# caret-from-point

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

[caretFromPoint](functions/caretFromPoint.md)

</td>
<td>

Gets the caret position from a point in the document.

This function tries browser-specific methods to determine the DOM position
(node and offset) at the given screen coordinates. It handles both Firefox's
`caretPositionFromPoint` and Chrome/Safari's `caretRangeFromPoint`.

The offset is clipped to the node size to handle edge cases where browsers
might return invalid offsets (e.g., text offsets into \<input\> nodes).

**Example**

```typescript
const position = caretFromPoint(document, event.clientX, event.clientY);
if (position) {
  console.log("Caret is at:", position.node, position.offset);
}
```

</td>
</tr>
</tbody>
</table>
