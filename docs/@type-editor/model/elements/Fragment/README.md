[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / elements/Fragment

# elements/Fragment

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[Fragment](classes/Fragment.md)

</td>
<td>

A fragment represents a node's collection of child nodes.

Like nodes, fragments are persistent data structures, and you
should not mutate them or their content. Rather, you create new
instances whenever needed. The API tries to make this easy.

Fragments are used to store the content of block nodes and the entire
document. They provide efficient operations for accessing, comparing,
and manipulating sequences of nodes while maintaining immutability.

Key characteristics:

- Immutable: All modification methods return new Fragment instances
- Efficient: Adjacent text nodes with the same marks are automatically merged
- Persistent: Safe to share between different parts of the application
- Size-aware: Tracks total size for efficient position calculations

**Example**

```typescript
// Create a fragment from an array of nodes
const fragment = Fragment.fromArray([node1, node2, node3]);

// Extract a sub-fragment
const subFragment = fragment.cut(5, 15);

// Iterate over children
fragment.forEach((node, offset, index) => {
  console.log(`Node ${index} at offset ${offset}`);
});
```

</td>
</tr>
</tbody>
</table>
