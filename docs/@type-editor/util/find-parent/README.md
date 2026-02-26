[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/util](../README.md) / find-parent

# find-parent

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

[findCommonParent](functions/findCommonParent.md)

</td>
<td>

Finds the deepest common ancestor node that contains both ends of the selection.

For a collapsed selection or when both ends share the same parent,
returns that immediate parent. For selections spanning multiple nodes,
traverses upward to find the first ancestor that contains both endpoints.

**Example**

```typescript
// Get the container of the current selection
const container = findCommonParent(selection);
if (container) {
  console.log("Selection is within:", container.node.type.name);
}
```

</td>
</tr>
<tr>
<td>

[findParent](functions/findParent.md)

</td>
<td>

Finds the nearest ancestor node in the document tree that satisfies the given predicate.

The search starts from the common parent of the selection and traverses upward
through the document hierarchy until a matching node is found or the root is reached.

**Example**

```typescript
// Find the nearest list item ancestor
const listItem = findParent(
  selection,
  (node) => node.type.name === "list_item",
);
```

</td>
</tr>
<tr>
<td>

[findParentByType](functions/findParentByType.md)

</td>
<td>

Finds the nearest ancestor node of a specific type.

This is a convenience wrapper around [findParent](functions/findParent.md) that matches nodes by their type.

**Example**

```typescript
// Find the nearest paragraph ancestor
const paragraph = findParentByType(selection, schema.nodes.paragraph);
```

</td>
</tr>
</tbody>
</table>
