[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / block-changes/util

# block-changes/util

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

[clearIncompatible](functions/clearIncompatible.md)

</td>
<td>

Remove nodes and marks that are incompatible with the given parent node type.

Used to clean up content when changing a node's type to ensure schema compliance.
This is particularly useful when converting between node types (e.g., paragraph to
heading) where the allowed content or marks may differ.

This function performs the following operations:

1. Removes child nodes that don't fit in the parent's content model
2. Removes marks that aren't allowed on child nodes
3. Optionally replaces newlines with spaces in text nodes (for non-pre whitespace)
4. Fills any required content at the end if needed (to satisfy content expressions)

**Throws**

When position is negative or no node exists at the position.

**Example**

```typescript
// Clean up content when converting a paragraph to a heading
clearIncompatible(tr, paragraphPos, schema.nodes.heading);
```

</td>
</tr>
<tr>
<td>

[replaceLinebreaks](functions/replaceLinebreaks.md)

</td>
<td>

Replace all linebreak replacement nodes with newline characters.
This is used when joining blocks that should collapse line breaks to text.

</td>
</tr>
<tr>
<td>

[replaceNewlines](functions/replaceNewlines.md)

</td>
<td>

Replace all newline characters in text nodes with linebreak replacement nodes.
This is used when joining blocks that should preserve line breaks as nodes.

</td>
</tr>
</tbody>
</table>
