[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / set-attribute

# set-attribute

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

[setAttribute](functions/setAttribute.md)

</td>
<td>

Creates a command that sets an attribute on nodes within the current selection.

This command has two modes of operation:

1. **Parent mode** (when `applyToParent` is specified): Finds the outermost ancestor node
   matching one of the specified node types and sets the attribute on it. This is useful
   for setting attributes on block-level containers like paragraphs or headings.

2. **Selection mode** (default): Traverses all nodes within the selection range and
   updates the attribute on any non-text node that supports it.

The command preserves the current selection after applying changes and uses structural
sharing to minimize memory allocations when transforming the document.

</td>
</tr>
</tbody>
</table>
