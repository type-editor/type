[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / types/dom-change/DocumentChange

# types/dom-change/DocumentChange

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

[DocumentChange](interfaces/DocumentChange.md)

</td>
<td>

Represents a change detected in the document by comparing old and new content.

This interface describes the positions where content has changed, with
separate end positions for the old document (endA) and new document (endB).

DocumentChange

**Example**

```typescript
// User types "x" at position 5
const change: DocumentChange = {
  start: 5, // Change starts at position 5
  endA: 5, // Old document ends at 5 (nothing was there)
  endB: 6, // New document ends at 6 (one char added)
};
```

</td>
</tr>
</tbody>
</table>
