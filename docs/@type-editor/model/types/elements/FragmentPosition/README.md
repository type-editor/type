[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / types/elements/FragmentPosition

# types/elements/FragmentPosition

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

[FragmentPosition](interfaces/FragmentPosition.md)

</td>
<td>

Represents a position within a fragment using child index and offset.

This interface provides an alternative way to specify positions within a fragment,
using the index of a child node and an offset within that child, rather than
an absolute position. This is particularly useful for operations that need to
identify both which child node contains a position and where within that node
the position lies.

**Example**

```typescript
// For a fragment with children of sizes [5, 3, 7]
// Position 8 would be:
const diffIndex: DiffIndex = {
  index: 2, // Third child (0-indexed)
  offset: 5, // Starts at position 5 (5 + 3)
};
```

</td>
</tr>
</tbody>
</table>
